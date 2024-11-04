import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User, UserConfirmation } from "@prisma/client";
import { Queue } from "bull";
import { EmailJobData } from "../repositories/dtos/emailJobData";
import { JOB_NAME } from "./email.const";
import backendVersion from "../../backend-version";
import { formatCheddr } from "../../common/utils/formatCheddr";
import { Decimal } from "@prisma/client/runtime/library";
import { COMMON_PATHS } from "./email-paths.const";

type OrderConfirmationEmailData = {
  order: {
    location: string | null;
    time: string | null;
    items: {
      name: string | null;
    }[];
    totalAmount: number;
    cheddrAmount: Decimal;
  };
  user: {
    name: string | null;
    email: string | null;
  };
  vendor: {
    name: string | null;
  };
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private frontendBaseUrl: string;

  constructor(
    private configService: ConfigService,
    @InjectQueue("email-queue") private emailQueue: Queue<EmailJobData>
  ) {
    this.frontendBaseUrl = this.configService.getOrThrow<string>("FRONTEND_BASE_URL");
  }

  public async sendStartupMail() {
    try {
      if (!this.frontendBaseUrl.startsWith("http://localhost")) {
        const senderEmail = this.configService.getOrThrow<string>("SENDER_EMAIL");
        await this.enqueueEmail({
          email: senderEmail,
          subject: `Server ${this.frontendBaseUrl} started`,
          body: `All ok, version ${backendVersion}`
        });
      } else {
        this.logger.log("starting up locally, not sending a notification mail");
      }
    } catch (error) {
      this.logger.error(`Error sending startup mail ${error} - ignoring...`);
    }
  }

  public async sendConfirmCodeMail(user: User, userConfirmation: UserConfirmation) {
    if (!user.email) {
      throw new Error("cant confirm mail for users without email");
    }
    const code = userConfirmation.confirm_email_code;
    if (!code) {
      throw new Error("there is no code to send out for the user!");
    }
    const urlToVisit = `${this.frontendBaseUrl}${COMMON_PATHS.CONFIRM_EMAIL(user.id, code)}`;
    const body = `
Welcome to Cheddr! 

Please visit ${urlToVisit} to confirm your email address or use the code ${code} after login. 

`;
    const subject = "Confirm your email for CPC Payment Component";
    await this.enqueueEmail({
      subject,
      body,
      email: user.email
    });
  }

  async sendOrderConfirmationEmail(data: OrderConfirmationEmailData) {
    const { order, user, vendor } = data;

    if (!user?.email) {
      throw new Error("Can't send confirmation email to users without an email address");
    }

    const itemsList = order.items.map(item => `${item.name}`).join(", ");

    const emailSubject = `Your order with ${vendor.name} has been confirmed`;

    let deliveryDetails: string;
    if (order.location) {
      deliveryDetails = `Your order will be available for pickup at ${order.location} during the time slot ${order.time ?? "specified"}.`;
    } else {
      deliveryDetails = `Your order is now ready for pickup. Please proceed to the vendor's location as you are already in front of them.`;
    }

    const emailBody = `
    Dear ${user.name},

    Thank you for your order! We are pleased to confirm the details below:

    Order Summary:
    Items: ${itemsList}
    Total Price: ${order.totalAmount} USD / ${formatCheddr(order.cheddrAmount)} Cheddr

    Delivery Details:
    ${deliveryDetails}

    Thank you for choosing ${vendor.name}. We look forward to serving you!

    Best regards,
    ${vendor.name} Team
  `;

    await this.enqueueEmail({
      subject: emailSubject,
      body: emailBody,
      email: user.email
    });
  }

  public async sendChangeEmailRequestMail(user: User, newEmail: string, changeEmailCode: string) {
    if (!user.email) {
      throw new Error("User does not have an email address.");
    }

    const urlToVisit = `${this.frontendBaseUrl}${COMMON_PATHS.CONFIRM_CHANGE_EMAIL(user.id, changeEmailCode)}`;
    const body = `
Hi ${user.first_name},

Please confirm your new email address by visiting the following link: ${urlToVisit}

If you did not request this change, please ignore this email.

Thanks,
Your Company`;

    const subject = "Confirm your new email address";
    await this.enqueueEmail({
      subject,
      body,
      email: newEmail
    });
  }

  private async enqueueEmail(payload: EmailJobData) {
    this.logger.log(`Adding email ${payload.email} to queue`);
    await this.emailQueue.add(JOB_NAME, payload); // Ensure payload includes provider if needed
    this.logger.log(`Done adding email ${payload.email} to queue`);
  }
}
