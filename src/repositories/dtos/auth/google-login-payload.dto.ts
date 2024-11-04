import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GoogleLoginPayloadDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: true
  })
  // @IsString()
  // @IsNotEmpty()
  // readonly displayName: string;
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @IsString()
  @IsOptional()
  readonly last_name: string;
}
