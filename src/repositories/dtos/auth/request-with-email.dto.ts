import RequiredDateProperty from "../../../../common/utils/annotations/dto/required-date-property";
import { OptionalDateProperty } from "../../../../common/utils/annotations/dto/optional-date.property";
import OptionalStringProperty from "../../../../common/utils/annotations/dto/optional-string.property";
import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";

export class RequestWithEmailDto {
  @RequiredStringProperty("email to send a magic login link to")
  readonly email: string;
}

export class DateRange {
  @RequiredDateProperty("which failed emails should be sent, inclusive")
  from: Date;

  @OptionalDateProperty("which failed emails should be sent until, inclusive. Default: now")
  to?: Date;
}

export class ResendEmailsDto {
  @OptionalStringProperty("email of which person to resend, or resend all failed if not given")
  email?: string;
}
