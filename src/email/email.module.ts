import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RepositoriesModule } from "../repositories";
import { EmailService } from "./email.service";
import { QUEUE_NAME } from "./email.const";
import { GmailProcessor } from "./gmail-processor";
import { SendGridProcessor } from "./sendgrid.processor";
import { FallbackMailProcessor } from "../email/fallback-mail.processor";
import { Queue } from "bull";
import { EmailJobData } from "../repositories/dtos/emailJobData";

@Module({
  controllers: [],
  imports: [
    RepositoriesModule,
    ConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        name: QUEUE_NAME,
        limiter: {
          max: 1,
          duration: configService.get("EVENT_QUEUE_WAIT_SECONDS", 1) * 1000,
          bounceBack: false
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    EmailService,
    {
      provide: "EMAIL_PROCESSOR",
      useFactory: async (configService: ConfigService, emailQueue: Queue<EmailJobData>) => {
        const provider = configService.get<string>("EMAIL_PROVIDER");
        switch (provider) {
          case "sendgrid":
            return new SendGridProcessor(configService, emailQueue);
          case "gmail":
            return new GmailProcessor(configService, emailQueue);
          default:
            return new FallbackMailProcessor(configService, emailQueue);
        }
      },
      inject: [ConfigService, `BullQueue_${QUEUE_NAME}`]
    }
  ],
  exports: [EmailService, "EMAIL_PROCESSOR"] // Export the dynamic provider
})
export class EmailModule implements OnModuleInit {
  constructor(@Inject() private readonly service: EmailService) {}

  async onModuleInit() {
    /*we are sending the mail not via the native mail processor, but via email service. this way we also know if the Bull subsystem is correctly initializing*/
    await this.service.sendStartupMail();
  }
}
