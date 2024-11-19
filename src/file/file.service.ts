import { fixUpload7BitAsciiFileName } from "../../common/utils";
import { UploadedFileDto, UploadedFileRoleDto } from "../file/file-dto";
import { ImageProperties, UploadedFile } from "../file/uploaded-file";
import { JwtPayloadDto } from "../repositories/dtos/auth";
import { PrismaService } from "../repositories/prisma.service";
import { InjectQueue } from "@nestjs/bull";
import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { ImageSize } from "@prisma/client";
import { Queue } from "bull";
import { BullJobNames, IMAGE_PROCESS_QUEUE } from "../../common/queues.constants";
import { copyFileSync, existsSync } from "fs";
import mime from "mime-types";
import { JwtManagmentService } from "../auth/services/jwt-managment.service";
import * as path from "path";
import { join } from "path";

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(IMAGE_PROCESS_QUEUE) private imageProcessQueue: Queue,
    private jwtManagmentService: JwtManagmentService
  ) {}

  public async createForUser(files: UploadedFile[], fileRole: string, userDto: JwtPayloadDto) {
    const results: UploadedFileDto[] = await Promise.all(
      files.map(async f => {
        const id = path.parse(f.filename).name;
        const fixedFileName = f.encoding === "7bit" ? fixUpload7BitAsciiFileName(f.originalname) : f.originalname;

        // Read only the first chunk of the file to determine its type
        const filePath = `./upload/files/original/${f.filename}`;
        const fileTypeResult = (await this.detectFileType(filePath)).toString();

        if (!fileTypeResult.startsWith("image/")) {
          throw new UnprocessableEntityException(`File ${f.originalname} is not a valid image.`);
        }
        const createdFile = await this.prisma.file.create({
          data: {
            id: id,
            diskName: f.filename,
            originalFileName: fixedFileName,
            size: f.size,
            fileFormat: f.mimetype,
            uploader_user_id: userDto.sub
          }
        });
        const createdImage = await this.prisma.image.create({
          data: {
            fileId: createdFile.id
          }
        });

        await this.imageProcessQueue.add(BullJobNames.VALIDATE_IMAGE, {
          filePath,
          fileId: createdImage.fileId,
          imageId: createdImage.id
        });
        const originalExtension = this.getExtensionFromMimeType(f.mimetype);
        const token = await this.jwtManagmentService.generateImageToken(
          createdImage.fileId!,
          userDto?.sub,
          originalExtension,
          fileRole
        );

        return { id: createdImage.id, token };
      })
    );
    return results;
  }

  public async createImageVariantsJob(fileId: string, imageId: string, filePath: string, properties: ImageProperties) {
    await this.imageProcessQueue.add(BullJobNames.VARIANT_IMAGE, {
      fileId,
      imageId,
      filePath,
      properties
    });
  }

  async createImageVariation(
    fileId: string,
    imageId: string,
    sizeKey: string,
    filePath: string,
    properties: ImageProperties
  ) {
    const fileExists = await this.prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!fileExists) {
      throw new Error(`File with ID ${fileId} does not exist.`);
    }
    await this.prisma.imageVariation.create({
      data: {
        fileId: fileId,
        size: sizeKey as ImageSize,
        filePath: filePath,
        originalImageId: imageId,
        resolutionWidth: properties.resolutionWidth,
        resolutionHeight: properties.resolutionHeight,
        // aspectRatio: properties.aspectRatio,
        // fileFormat: properties.fileFormat
      }
    });
  }

  async getTokenizedImagePath(size: ImageSize, token: string): Promise<string> {
    let fallbackPath;
    if (!token) {
      throw new UnprocessableEntityException("Token is required");
    }

    const decodedToken = await this.jwtManagmentService.decodeImageToken(token);
    const pathLookup: Record<ImageSize, string> = {
      THUMBNAIL: "generated",
      MEDIUM: "generated",
      LARGE: "generated",
      ORIGINAL: "original"
    };

    const sizePath = size === "ORIGINAL" ? "" : `/${size.toLowerCase()}`;

    const imagePath =
      size === "ORIGINAL" ? decodedToken.path.replace(/\.[^/.]+$/, decodedToken.originalExtension) : decodedToken.path;

    const relativePath = `upload/files/${pathLookup[size]}${sizePath}/${imagePath}`;
    const resolvedImagePath = join(__dirname, "..", "..", "..", "..", relativePath);

    if (existsSync(resolvedImagePath)) {
      return resolvedImagePath;
    } else {
      // fallback path
      if (decodedToken.fileRole === "userProfile") {
        fallbackPath = join(__dirname, "..", "..", "..", "..", `upload/files/public/fallback/user/userImage.png`); // replace demo image to actual fallback
      } else {
        fallbackPath = join(__dirname, "..", "..", "..", "..", `upload/files/public/fallback/product/productImage.png`); // replace demo image to actual fallback
      }

      if (existsSync(fallbackPath)) {
        return fallbackPath;
      } else {
        throw new NotFoundException("File and fallback image not found");
      }
    }
  }

  private getExtensionFromMimeType(mimeType: string): string {
    if (mimeType.startsWith("image/")) {
      return "." + mimeType.split("/")[1];
    }
    return ".webp"; //default for now
  }

  private async detectFileType(filePath: string) {
    return mime.lookup(filePath);
  }

  // Method to ensure that THUMBNAIL, MEDIUM, and LARGE variants exist in /public
  /*todo andreas think through security implications of knowing the image id, do we need an access check?*/
  async ensureImageExistsInPublic(imageId: string) {
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
      include: { File: true }
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
    if (!image.File) {
      throw new NotFoundException(`Image with ID ${imageId} does not have a file`);
    }
    const privatePath = join(__dirname, "..", "..", "..", "..", "upload/files/generated");
    const publicPath = join(__dirname, "..", "..", "..", "..", "upload/files/public");

    const ensureSizes: ImageSize[] = ["THUMBNAIL", "MEDIUM", "LARGE"];
    for (const variant of ensureSizes) {
      const sourcePath = join(publicPath, variant.toLowerCase());
      const destinationPath = join(privatePath, variant.toLowerCase());
      const sourceFile = join(sourcePath, image.File.diskName.replace(/\.[^/.]+$/, ".webp"));
      const destinationFile = join(destinationPath, image.File.diskName.replace(/\.[^/.]+$/, ".webp"));

      if (!existsSync(sourceFile)) {
        copyFileSync(destinationFile, sourceFile);
      }
    }
  }
}
