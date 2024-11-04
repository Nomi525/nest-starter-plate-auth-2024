import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";
import UuidProperty from "../../../../common/utils/annotations/dto/uuid.property";

export class GetPublicUserDto {
  @UuidProperty("user id", true)
  readonly id: string;

  @RequiredStringProperty("User First Name")
  readonly first_name: string;

  @RequiredStringProperty("User Last Name")
  readonly last_name: string;
}
