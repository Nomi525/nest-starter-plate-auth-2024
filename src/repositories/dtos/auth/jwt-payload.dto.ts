import { JwtRequestDto } from "./jwt-request.dto";
import { UserRole } from "@prisma/client";
import UuidProperty from "../../../../common/utils/annotations/dto/uuid.property";
import { EnumProperty } from "../../../../common/utils/annotations/dto/enum.property";
import RequiredEmailProperty from "../../../../common/utils/annotations/dto/required-email.property";
import OptionalNumberProperty from "../../../../common/utils/annotations/dto/optional-number.property";
import RequiredNumberProperty from "../../../../common/utils/annotations/dto/required-number.property";

export class JwtPayloadDto implements JwtRequestDto {
  @RequiredEmailProperty("User email")
  readonly email: string;

  @UuidProperty("User Id", true)
  readonly sub: string;

  @UuidProperty("AccessToken identifier", true)
  readonly jti: string;

  @EnumProperty(UserRole, "User role")
  readonly role: UserRole;

  @OptionalNumberProperty("issued at, added automatically")
  readonly iat?: number;

  @RequiredNumberProperty("expiration date, added automatically")
  readonly exp: number;

  constructor(user: { email: string; id: string; role: UserRole }, tokenId: string) {
    this.email = user.email;
    this.sub = user.id;
    this.jti = tokenId;
    this.role = user.role;
  }
}
