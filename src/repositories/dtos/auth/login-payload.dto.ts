import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";

export class LoginPayloadDto {
  @RequiredStringProperty("email to log in with")
  readonly email: string;

  @RequiredStringProperty("auth_hash to log in with")
  readonly password: string;
}
