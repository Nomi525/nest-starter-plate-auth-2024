import { Timeout } from "../../common/decorators/timeout.decorator";
import { PublicGetRequest } from "../../common/utils/annotations/controllers/public-get-request";
import { FileService } from "../file/file.service";
import { JwtPayloadDto } from "../repositories/dtos/auth";
import { CreatedIdDto } from "../repositories/dtos/created-id.dto";
import {
  Body,
  Catch,
  Controller,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { ImageSize } from "@prisma/client";
import { AuthorizedUser } from "../../common/decorators";
import { Response } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";
import { JwtAuthGuard } from "../auth/guards";
import { UploadedFile } from "./uploaded-file";
import { statSync } from "fs";
import { createHash } from "crypto";
import { UploadedFileRoleDto } from "./file-dto";

/*
 * todo final flow for iamges
 *  3 create size variants with seperate job, store them in /generated
 *  4 be able to serve the iamges via dyanmic endpoint
 *  5 when an image is references by a public resource such as menu item we make sure it exists also in /public/SIZE
 *  6 make sure we are serving /public directly via static file ServeStaticModule (done)
 *  7 whenever we return a image reference in the api, include either a token for private access or a reference to a public file id
 *
 * */
@ApiTags("files")
@Catch()
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse()
@Controller("files")
export class FilesController {
  constructor(private service: FileService) {}

  private readonly logger = new Logger(FilesController.name);

  @ApiOkResponse({
    type: CreatedIdDto,
    isArray: true,
    description: "List of DB IDs of the uploaded files"
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "List of files to be uploaded",
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary"
          }
        },
        role: {
          type: "string",
          format: "string",
          enum: ["userProfile", "product"]
        }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @Post()
  @Timeout(60 * 60000)
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: diskStorage({
        destination: "./upload/files/original/",
        filename: (req, file, cb) => {
          const uniqueId = uuid();
          const filename = `${uniqueId}${extname(file.originalname)}`;
          cb(null, filename);
        }
      })
    })
  )
  async uploadFile(
    @UploadedFiles() files: UploadedFile[],
    @Body() fileRole: UploadedFileRoleDto,
    @AuthorizedUser() userDto: JwtPayloadDto
  ) {
    return await this.service.createForUser(files, fileRole.role, userDto);
  }

  @ApiParam({
    name: "size",
    description: "Size of the image (e.g., original, thumbnail, medium, large)",
    enum: Object.values(ImageSize)
  })
  @ApiParam({
    name: "token",
    description: "The token of the file to retrieve",
    type: String
  })
  @PublicGetRequest(":size/:token", String, "Retrieve a specific image")
  async getTokenizedImage(@Param() params: { size: ImageSize; token: string }, @Res() res: Response) {
    const { size, token } = params;
    try {
      const imagePath = await this.service.getTokenizedImagePath(size, token);
      this.logger.verbose({ imagePath });

      if (imagePath) {
        const stats = statSync(imagePath);
        const eTag = createHash("md5")
          .update(stats.size.toString() + stats.mtime.getTime().toString())
          .digest("hex");

        // Checking if the client already has the resource cached
        const clientETag = res.req.headers["if-none-match"];
        if (clientETag && clientETag === eTag) {
          return res.status(HttpStatus.NOT_MODIFIED).send();
        }
        res.setHeader("ETag", eTag);
        return res.sendFile(imagePath);
      } else {
        return res.status(HttpStatus.NOT_FOUND).send("File not found, fallback image is also missing!!");
      }
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).send("Invalid or expired token");
    }
  }
}
