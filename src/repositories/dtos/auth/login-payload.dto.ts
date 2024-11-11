import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";

export class LoginPayloadDto {
  @RequiredStringProperty("email to log in with")
  email: string;
  // _email: string;

  @RequiredStringProperty("auth_hash to log in with")
  password: string;
  // _password: string;
}
