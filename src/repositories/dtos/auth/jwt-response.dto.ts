import { IsJWT } from "class-validator";
import OptionalStringProperty from "../../../../common/utils/annotations/dto/optional-string.property";
import RequiredBooleanProperty from "../../../../common/utils/annotations/dto/required-boolean.property";
import RequiredEmailProperty from "../../../../common/utils/annotations/dto/required-email.property";
import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";
import UuidProperty from "../../../../common/utils/annotations/dto/uuid.property";
import { UserRole } from "@prisma/client";
import EnumProperty from "../../../../common/utils/annotations/dto/enum.property";

export class JwtResponseDto {
  @UuidProperty("User Id", true)
  id: string;

  @RequiredEmailProperty("User email")
  email: string;

  /*todo when calling upgrade to vendor we might re-assign the jwtrepons with the new role*/
  @EnumProperty(UserRole, "User role")
  readonly role: UserRole;

  @RequiredBooleanProperty("Email confirmed")
  email_confirmed: boolean;

  @RequiredStringProperty("Access Token")
  @IsJWT()
  access_token: string;

  @RequiredStringProperty("Refresh token")
  @IsJWT()
  refresh_token: string;

  @OptionalStringProperty("Login message")
  message?: string;
}
