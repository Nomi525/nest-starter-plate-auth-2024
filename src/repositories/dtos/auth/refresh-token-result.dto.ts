import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class JWTVerifyResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly jti: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly sub: string;
}
