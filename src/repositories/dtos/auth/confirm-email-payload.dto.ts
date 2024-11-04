import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";
import { CreatedIdDto } from "../../../repositories/dtos/created-id.dto";

export class ConfirmEmailPayloadDto extends CreatedIdDto {
  @RequiredStringProperty("the Confirmation Code that was sent via email")
  confirm_code: string;
}
