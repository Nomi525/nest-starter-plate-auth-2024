import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";

export class ConfirmResetPasswordDto {
  @RequiredStringProperty("User id")
  id: string;

  @RequiredStringProperty("code that the user got via email")
  readonly code: string;

  @RequiredStringProperty("new Password that is being set")
  readonly newPassword: string;
}
