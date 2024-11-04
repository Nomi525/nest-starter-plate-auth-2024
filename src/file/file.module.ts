import { IMAGE_PROCESS_QUEUE } from "../../common/queues.constants";
import { AuthModule } from "../auth/auth.module";
import { ImageValidationProcessor } from "../file/Image-validation-processor";
import { RepositoriesModule } from "../repositories";
import { BullModule } from "@nestjs/bull";
import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as fs from "fs";
import { join } from "path";
import { FilesController } from "./file.controller";
import { FileService } from "./file.service";
import { ImageSizeVariantProcessor } from "./Image-variant-processor";
@Module({
  imports: [
    RepositoriesModule,
    BullModule.registerQueueAsync({
      name: IMAGE_PROCESS_QUEUE,
      imports: [ConfigModule],
      useFactory: async (_configService: ConfigService) => ({
        name: IMAGE_PROCESS_QUEUE,
        limiter: undefined, // No speed limit
        defaultJobOptions: {
          /*todo more of our queues should clean up after themselves, the history is not that important*/
          removeOnComplete: true // Optional: Clean up jobs after completion
        }
      }),
      inject: [ConfigService]
    }),
    AuthModule
  ],
  controllers: [FilesController],
  providers: [FileService, ImageValidationProcessor, ImageSizeVariantProcessor, FileService],
  exports: [FileService]
})
export class FilesModule implements OnModuleInit {
  private readonly logger = new Logger(FilesModule.name);

  private baseDirectory = "/upload/files";

  async onModuleInit() {
    const directories = [
      "generated/thumbnail",
      "generated/medium",
      "generated/large",
      "generated/original",
      "public/thumbnail",
      "public/medium",
      "public/large",
      "public/fallback/user",
      "public/fallback/product",
      "original"
    ];

    directories.forEach(dir => {
      const absolutePath = join(__dirname, "..", "..", "..", "..", `${this.baseDirectory}/${dir}`);
      if (!fs.existsSync(absolutePath)) {
        fs.mkdirSync(absolutePath, { recursive: true });
        this.logger.log(`Directory created: ${absolutePath}`);
      } else {
        this.logger.log(`Directory already exists: ${absolutePath}`);
      }
    });
  }
}
