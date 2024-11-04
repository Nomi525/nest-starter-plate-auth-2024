import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { Injectable } from "@nestjs/common";
import { JOB_NAME, QUEUE_NAME } from "./email.const";
import { google } from "googleapis";
import { ConfigService } from "@nestjs/config";
import { EmailJobData } from "../repositories/dtos/emailJobData";
import { BaseMailProcessor } from "../email/base-mail.processor";
import { OAuth2Client } from "google-auth-library";
import { formatError } from "../../common/utils/formatError";

export type TMailJobResult = { success: boolean };

class CustomOAuth2Client extends OAuth2Client {
  public async refreshIfExpiring() {
    if (this.isTokenExpiring()) {
      await this.refreshAccessToken();
    }
  }
}

@Injectable()
@Processor(QUEUE_NAME)
export class GmailProcessor extends BaseMailProcessor {
  private oauth2Client: CustomOAuth2Client;

  constructor(configService: ConfigService, @InjectQueue(QUEUE_NAME) emailQueue: Queue<EmailJobData>) {
    super(configService, emailQueue);
    const clientid = this.configService.get<string>("CLIENT_ID");
    const clientsecret = this.configService.get<string>("CLIENT_SECRET");
    const refreshtoken = this.configService.get<string>("REFRESH_TOKEN");
    this.oauth2Client = new CustomOAuth2Client(clientid, clientsecret, "https://developers.google.com/oauthplayground");

    this.oauth2Client.setCredentials({
      refresh_token: refreshtoken
    });
  }

  @Process(JOB_NAME)
  async sendEmail(job: Job<EmailJobData>): Promise<TMailJobResult> {
    const { subject, body, email } = job.data;
    this.validateEmail(email, subject);
    try {
      this.logger.log(`Processing mail ${email} from queue via Gmail`);
      await this.sendMail(subject, body, email);
      this.logger.log(`Processed mail ${email}`);
      return { success: true };
    } catch (error) {
      const errorMessage = formatError(error);
      this.logger.error(`Failed to send email via Gmail: ${errorMessage} jobid: ${job.id}`);
      throw error;
    }
  }

  protected async sendMail(subject: string, body: string, email: string) {
    this.validateEmail(email, subject);
    try {
      await this.oauth2Client.refreshIfExpiring();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.error(`Error refreshing token: ${errorMessage}`);
      throw e;
    }

    try {
      const gmail = google.gmail({ version: "v1", auth: this.oauth2Client });
      const senderEmail = this.configService.getOrThrow<string>("SENDER_EMAIL");

      const mimeMessage = `From: ${senderEmail}\r\nTo: ${email}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset="UTF-8"\r\nMIME-Version: 1.0\r\nContent-Transfer-Encoding: 7bit\r\n\r\n${body}`;
      const encodedMessage = Buffer.from(mimeMessage)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      this.logger.log(`Sending mail to ${email}`);

      //we ignore the response from send, nothing interesting here
      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage
        }
      });

      this.logger.log("Sent mail");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.error(`Unable to send mail: ${errorMessage}`);
      throw e;
    }
  }
}
