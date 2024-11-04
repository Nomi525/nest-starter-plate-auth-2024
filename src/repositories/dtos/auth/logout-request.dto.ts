import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class LogoutRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  readonly access_token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  readonly refresh_token: string;
}
