import { IsJWT } from "class-validator";
import RequiredStringProperty from "../../../../common/utils/annotations/dto/required-string.property";

export class RefreshTokenRequestDto {
  @RequiredStringProperty("refresh token")
  @IsJWT()
  readonly refresh_token: string;
}
