import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";

export class LoginDto {
  @RequiredStringProperty("User email")
  readonly email: string;

  @RequiredStringProperty("User password")
  readonly password: string;
}

export default LoginDto;
