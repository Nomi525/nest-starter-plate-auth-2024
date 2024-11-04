import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job, Queue } from "bull";
import { EmailJobData } from "../repositories/dtos/emailJobData";
import { DateRange } from "../repositories/dtos/auth/request-with-email.dto";
import { TMailJobResult } from "../email/email.const";
import { OnQueueCompleted, OnQueueFailed } from "@nestjs/bull";

@Injectable()
export abstract class BaseMailProcessor implements OnModuleInit {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly configService: ConfigService,
    protected emailQueue: Queue<EmailJobData>
  ) {}

  async onModuleInit() {
    this.logger.log("Init FallbackMailProcessor processing.");
    await this.sendFailedJobs();
  }

  async sendFailedJobs(dateRange?: DateRange) {
    try {
      const pendingJobs = await this.emailQueue.getJobs(["waiting", "active", "delayed", "paused", "failed"]);
      this.logger.log(`Found ${pendingJobs.length} open emails to process`);
      for (const job of pendingJobs) {
        const toDate = dateRange?.to ?? new Date();
        const toAllowed = toDate.getTime() > job.timestamp;
        const fromAllowed = !dateRange || dateRange.from.getTime() < job.timestamp;
        if (fromAllowed && toAllowed) {
          try {
            await job.retry();
            this.logger.log(`Sent mail to ${job.data.email} during recovery`);
          } catch (error) {
            this.logger.error(`Failed to process pending job ${job.id} to ${job.data.email}: ${error}`);
          }
        } else {
          this.logger.error(`Skipped sending ${await job.getState()} mail #${job.id} due to time restrictions`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to fetch pending jobs: ${error}`);
    }
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job<EmailJobData>, error: Error) {
    this.logger.error(`Failed job ${job.id}: ${error.message}`);
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job<EmailJobData>, result: TMailJobResult) {
    this.logger.log(`Completed job ${job.id} with result: ${result.success}`);
  }

  abstract sendEmail(job: Job<EmailJobData>): Promise<TMailJobResult>;

  protected validateEmail(email: string, subject: string) {
    if (!email || email.length === 0) {
      const message = `Invalid email address for subject ${subject}`;
      this.logger.error(message);
      throw new Error(message);
    }
  }

  protected abstract sendMail(subject: string, body: string, email: string): Promise<void>;
}
