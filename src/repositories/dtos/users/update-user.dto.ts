import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";
import UuidProperty from "../../../../common/utils/annotations/dto/uuid.property";
import { CreatedIdDto } from "../../../repositories/dtos/created-id.dto";

/*meant to be submitted when a user updates their data */
export class UpdateUserDto extends CreatedIdDto {
  @RequiredStringProperty("User new First Name")
  readonly first_name: string;

  @RequiredStringProperty("User new Last Name")
  readonly last_name: string;

  @RequiredStringProperty("The users new Email Address")
  readonly email: string;

  @UuidProperty("File id of the profile picture uploaded note this does not apply to 'creators'", false)
  readonly profile_pic_id?: string;
}
