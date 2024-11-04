import { CreatedIdDto } from "../../../repositories/dtos/created-id.dto";
import RequiredBooleanProperty from "../../../../common/utils/annotations/dto/required-boolean.property";

export class UserUpdateResultDto extends CreatedIdDto {
  @RequiredBooleanProperty("if a Confirmation Code needs to be entered again")
  readonly needs_confirm_code: boolean;
}
