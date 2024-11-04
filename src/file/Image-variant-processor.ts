import { FileService } from "../file/file.service";
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { ImageSize } from "@prisma/client";
import { Job } from "bull";
import { ImageVariantJobData } from "../../common/blockchainJobData.dto";
import { BullJobNames, IMAGE_PROCESS_QUEUE } from "../../common/queues.constants";
import path from "path";
import sharp from "sharp";

@Processor(IMAGE_PROCESS_QUEUE)
export class ImageSizeVariantProcessor {
  private readonly logger = new Logger(ImageSizeVariantProcessor.name);

  constructor(private fileService: FileService) {}

  private readonly imageSizes: Record<ImageSize, { width?: number; maxHeight?: number }> = {
    THUMBNAIL: { width: 150, maxHeight: 300 },
    MEDIUM: { width: 600, maxHeight: 1200 },
    LARGE: { width: 1280, maxHeight: 2560 },
    ORIGINAL: { width: undefined, maxHeight: undefined } // Keep original size
  };

  @Process(BullJobNames.VARIANT_IMAGE)
  async handleCreateImageVariants(job: Job<ImageVariantJobData>) {
    const { fileId, imageId, filePath, properties } = job.data;
    try {
      const originalImage = sharp(filePath);
      const generatedDir = "./upload/files/generated";

      for (const [sizeKey, sizeValue] of Object.entries(this.imageSizes)) {
        // if (sizeKey === "ORIGINAL") continue;

        const variationDir = `${generatedDir}/${sizeKey.toLowerCase()}`;
        const outputFilePath = path.join(variationDir, `${fileId}.webp`);

        const resizedImage = originalImage.clone().resize({
          width: sizeValue.width,
          height: sizeValue.maxHeight,
          fit: "inside",
          withoutEnlargement: true
        });
        /*todo make absolute path*/
        await resizedImage.webp({ quality: 80 }).toFile(outputFilePath);

        await this.fileService.createImageVariation(fileId, imageId, sizeKey, outputFilePath, properties);
      }
    } catch (error) {
      console.error(`Error creating image variants for file ID: ${fileId}`, error);
      throw error;
    }
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job) {
    this.logger.log(`Job completed with id ${job.id}`);
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    this.logger.error(`Job failed with id ${job.id}`, err.stack);
  }
}
