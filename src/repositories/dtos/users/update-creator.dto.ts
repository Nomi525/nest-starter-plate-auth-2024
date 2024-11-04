import { CreatedIdDto } from "../../../repositories/dtos/created-id.dto";
import UuidProperty from "../../../../common/utils/annotations/dto/uuid.property";
import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";

/*meant to be submitted when a creator updates its data */
export class UpdateCreatorDto extends CreatedIdDto {
  @RequiredStringProperty("name of the User.")
  readonly name: string;

  @UuidProperty("File id of the profile picture uploaded note this does not apply to 'creators'", true)
  readonly profile_pic_id: string;
}
