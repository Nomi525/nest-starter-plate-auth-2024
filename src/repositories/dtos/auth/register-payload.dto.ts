import { UserRole } from "@prisma/client";
import RequiredEmailProperty from "../../../../common/utils/annotations/dto/required-email.property";
import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";
import OptionalStringProperty from "../../../../common/utils/annotations/dto/optional-string.property";
import RequiredProperty from "../../../../common/utils/annotations/dto/required.property";

export class UpgradeGuestPayloadDto {
  // @RequiredStringProperty("User Name")
  // readonly name: string;

  @RequiredStringProperty("User First Name")
  readonly first_name: string;

  @RequiredStringProperty("User Last Name")
  readonly last_name: string;

  @RequiredStringProperty("User Password")
  readonly auth_pass: string;

  @RequiredEmailProperty("User Email")
  readonly email: string;
}

export class RegisterPayloadDto {
  @RequiredEmailProperty("User Email")
  readonly email: string;

  @OptionalStringProperty("User First Name")
  readonly first_name: string;

  @OptionalStringProperty("User Last Name")
  readonly last_name: string;

  @RequiredStringProperty("User Auth Pass Hash")
  readonly pass_hash: string;

  // @RequiredStringProperty("User Server Salt")
  // readonly server_salt: string;

  // @RequiredStringProperty("User EOA Address")
  // readonly user_EOA_address: string;

  @OptionalStringProperty("only for vendors to set!")
  readonly manager_name?: string;

  @OptionalStringProperty("role for user/Manager")
  readonly role?: UserRole;
}

export class ChangePasswordDto {
  @RequiredStringProperty("old User Auth Hash")
  readonly oldAuthHash: string;

  @RequiredStringProperty("new User Auth Hash")
  readonly newAuthHash: string;

  // @RequiredStringProperty("new User Server Salt")
  // readonly server_salt: string;
}

export class SiweMessageDto {
  @RequiredStringProperty("message that was signed")
  message: string;

  @RequiredStringProperty("signature, hex")
  signature: string;
}

export class SetPasswordUsingWalletDto {
  @RequiredProperty("a signed message for changing the password")
  siweMessageDto: SiweMessageDto;

  @RequiredStringProperty("new User Auth Hash")
  newAuthHash: string;

  @RequiredStringProperty("new User Server Salt")
  server_salt: string;
}

export class NonceDto {
  @RequiredStringProperty("next nonce that will be needed for SIWE")
  nonce: string;
}
