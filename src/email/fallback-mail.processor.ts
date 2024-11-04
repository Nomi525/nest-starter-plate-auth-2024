import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job, Queue } from "bull";
import { EmailJobData } from "../repositories/dtos/emailJobData";
import { JOB_NAME, QUEUE_NAME } from "./email.const";
import { BaseMailProcessor } from "./base-mail.processor";

type TMailJobResult = { success: boolean };

@Injectable()
@Processor(QUEUE_NAME)
export class FallbackMailProcessor extends BaseMailProcessor {
  constructor(configService: ConfigService, @InjectQueue(QUEUE_NAME) emailQueue: Queue<EmailJobData>) {
    super(configService, emailQueue);
  }

  @Process(JOB_NAME)
  async sendEmail(job: Job<EmailJobData>): Promise<TMailJobResult> {
    const { subject, body, email } = job.data;
    this.validateEmail(email, subject);
    this.logEmailToConsole(subject, body, email);
    return { success: true };
  }

  protected logEmailToConsole(subject: string, body: string, email: string) {
    this.logger.log(`Logging email to console\nTo: ${email}\nSubject: ${subject}\nBody: ${body}`);
  }

  protected async sendMail(subject: string, body: string, email: string) {
    this.logEmailToConsole(subject, body, email);
  }
}
