import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "@sendgrid/mail";
import { Job, Queue } from "bull";
import { EmailJobData } from "../repositories/dtos/emailJobData";
import { JOB_NAME, QUEUE_NAME } from "./email.const";
import { BaseMailProcessor } from "../email/base-mail.processor";
import { formatError } from "../../common/utils/formatError";

type TMailJobResult = { success: boolean };

@Injectable()
@Processor(QUEUE_NAME)
export class SendGridProcessor extends BaseMailProcessor {
  private sendGridApiKey: string;

  constructor(configService: ConfigService, @InjectQueue(QUEUE_NAME) emailQueue: Queue<EmailJobData>) {
    super(configService, emailQueue);
    this.sendGridApiKey = this.configService.getOrThrow<string>("SENDGRID_API_KEY");
    const senderEmail = this.configService.getOrThrow<string>("SENDER_EMAIL");
    if (!this.sendGridApiKey || !senderEmail) {
      this.logger.error("SendGrid configuration is incomplete");
    }
  }

  @Process(JOB_NAME)
  async sendEmail(job: Job<EmailJobData>): Promise<TMailJobResult> {
    const { subject, body, email } = job.data;
    this.validateEmail(email, subject);
    try {
      this.logger.log(`Processing mail ${email} from queue via SendGrid`);
      await this.sendMail(subject, body, email);
      this.logger.log(`Processed mail ${email}`);
      return { success: true };
    } catch (error) {
      const errorMessage = formatError(error);
      this.logger.error(`Failed to send email via SendGrid: ${errorMessage} jobid: ${job.id}`);
      throw error;
    }
  }

  public async sendMail(subject: string, body: string, email: string) {
    this.validateEmail(email, subject);
    const mailService = new MailService();
    mailService.setApiKey(this.sendGridApiKey);
    const senderEmail = this.configService.getOrThrow<string>("SENDER_EMAIL");

    const msg = {
      to: email,
      from: senderEmail,
      subject: subject,
      text: body
    };

    try {
      await mailService.send(msg);
      this.logger.log(`Sent mail to ${email} via SendGrid`);
    } catch (error) {
      const errorMessage = formatError(error);
      this.logger.error(`Unable to send mail via SendGrid: ${errorMessage}`);
      throw error;
    }
  }
}
