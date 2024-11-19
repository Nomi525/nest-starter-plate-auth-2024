import { UserRole } from "@prisma/client";
import RequiredEmailProperty from "../../../../common/utils/annotations/dto/required-email.property";
import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";
import OptionalStringProperty from "../../../../common/utils/annotations/dto/optional-string.property";
import RequiredProperty from "../../../../common/utils/annotations/dto/required.property";
import RequiredArrayProperty from "../../../../common/utils/annotations/dto/required-array.property";
import { IsString } from "class-validator";

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

// export class LanguageKnowsDto {
//   @RequiredStringProperty("name of the language")
//   id: string;
// }

export class RegisterPayloadDto {
  @RequiredEmailProperty("Employee Email")
  readonly email: string;

  @OptionalStringProperty("Employee First Name")
  readonly first_name: string;

  @OptionalStringProperty("Employee Last Name")
  readonly last_name: string;

  @RequiredStringProperty("Employee ID")
  readonly empId: string;

 @RequiredStringProperty("User Auth Pass Hash")
  readonly pass_hash: string;

  @OptionalStringProperty("only for manager to set!")
  readonly manager_name?: string;

  @IsString({ each: true })
  @RequiredArrayProperty(String,"languages like english hindi marathi")
  readonly languageIds: string[];

  @OptionalStringProperty("role for user/Manager")
  readonly role?: UserRole;

  @RequiredStringProperty("Shift start date (DD/MM/YYYY)")
  readonly shift_start_date: string;

  @RequiredStringProperty("Shift end date (DD/MM/YYYY)")
  readonly shift_end_date: string;

  @RequiredStringProperty("Employment shift duration")
  readonly shift_duration: string;
  
  @RequiredStringProperty("Employment start date (DD/MM/YYYY)")
  readonly employment_start_date: string;
  
}

export class ChangePasswordDto {
  @RequiredStringProperty("old User Auth Hash")
  readonly oldAuthHash: string;

  @RequiredStringProperty("new User Auth Hash")
  readonly newAuthHash: string;

  // @RequiredStringProperty("new User Server Salt")
  // readonly server_salt: string;
}

// export class SetPasswordUsingWalletDto {
//   @RequiredProperty("a signed message for changing the password")
//   siweMessageDto: SiweMessageDto;

//   @RequiredStringProperty("new User Auth Hash")
//   newAuthHash: string;

//   @RequiredStringProperty("new User Server Salt")
//   server_salt: string;
// }

// export class NonceDto {
//   @RequiredStringProperty("next nonce that will be needed for SIWE")
//   nonce: string;
// }
