import { UserRole } from "@prisma/client";
import { GetPublicUserDto } from "../../../repositories/dtos/users/get-public-user.dto";
import { EnumProperty } from "../../../../common/utils/annotations/dto/enum.property";
import RequiredBooleanProperty from "../../../../common/utils/annotations/dto/required-boolean.property";
import RequiredEmailProperty from "../../../../common/utils/annotations/dto/required-email.property";

export class GetPrivateUserDto extends GetPublicUserDto {
  @RequiredEmailProperty("User Email")
  readonly email: string;

  @RequiredBooleanProperty("User Email is Confirmed")
  readonly email_confirmed: boolean;

  @EnumProperty(UserRole, "User Role")
  readonly role: UserRole;
}