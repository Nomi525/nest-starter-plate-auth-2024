import { FileService } from "../file/file.service";
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { ImageValidateJobData } from "../../common/blockchainJobData.dto";
import { BullJobNames, IMAGE_PROCESS_QUEUE } from "../../common/queues.constants";
import path from "path";
import sharp from "sharp";
import { ImageProperties } from "./uploaded-file";

@Processor(IMAGE_PROCESS_QUEUE)
export class ImageValidationProcessor {
  private readonly logger = new Logger(ImageValidationProcessor.name);

  constructor(private fileService: FileService) {}

  private readonly MAX_WIDTH = 3000;
  private readonly MAX_HEIGHT = 3000;

  @Process(BullJobNames.VALIDATE_IMAGE)
  async handleImageValidation(job: Job<ImageValidateJobData>) {
    const { filePath, fileId, imageId } = job.data;

    try {
      const originalImage = sharp(filePath);
      const metadata = await originalImage.metadata();
      this.logger.verbose({ metadata });
      if (!metadata.width || !metadata.height) {
        throw new Error(`Invalid image dimensions for file ID: ${fileId}`);
      }

      if (metadata.width > this.MAX_WIDTH || metadata.height > this.MAX_HEIGHT) {
        throw new Error("Image dimensions are too large");
      }

      const properties: ImageProperties = {
        resolutionWidth: metadata.width,
        resolutionHeight: metadata.height,
        aspectRatio: metadata.width / metadata.height,
        fileFormat: path.extname(filePath).slice(1)
      };
      await this.fileService.createImageVariantsJob(fileId, imageId, filePath, properties);
    } catch (error) {
      console.error(`Error processing image for file ID: ${fileId}`, error);
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
