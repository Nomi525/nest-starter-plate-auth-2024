import { UserRole } from "@prisma/client";
import RequiredEmailProperty from "../../../../common/utils/annotations/dto/required-email.property";
import UuidProperty from "../../../../common/utils/annotations/dto/uuid.property";
import OptionalNumberProperty from "../../../../common/utils/annotations/dto/optional-number.property";
import { EnumProperty } from "../../../../common/utils/annotations/dto/enum.property";

export class JwtRequestDto {
  @RequiredEmailProperty("User email")
  readonly email: string;

  @UuidProperty("User Id", true)
  readonly sub: string;

  @UuidProperty("AccessToken identifier")
  readonly jti: string;

  @EnumProperty(UserRole, "User role")
  readonly role: UserRole;

  @OptionalNumberProperty("issued at, added automatically")
  readonly iat?: number;

  @OptionalNumberProperty("expiration date, added automatically")
  readonly exp?: number;
}
