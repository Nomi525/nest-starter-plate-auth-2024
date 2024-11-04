import { JwtResponseDto } from "../../../repositories/dtos/auth/jwt-response.dto";
import RequiredBooleanProperty from "../../../../common/utils/annotations/dto/required-boolean.property";
import OptionalProperty from "../../../../common/utils/annotations/dto/optional.property";
import OptionalStringProperty from "../../../../common/utils/annotations/dto/optional-string.property";
import { CreatedIdDto } from "../created-id.dto";

export class RegisterResultDto extends CreatedIdDto {
  @RequiredBooleanProperty("if the user needs to enter a Confirmation Code. let the ui know if it needs to redirect")
  needs_confirm_code?: boolean;

  @OptionalProperty("Login, even if the email is not verified yet")
  quickLoginInfo?: JwtResponseDto;

  @OptionalStringProperty("safe Wallet Address that was just created")
  safeWalletAddress?: string;
  @OptionalStringProperty("safe Wallet message")
  message?: string;
}
