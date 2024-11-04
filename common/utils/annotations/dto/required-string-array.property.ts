import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

function RequiredStringArray(description: string) {
  return function (target: object, propertyKey: string) {
    ApiProperty({
      isArray: true,
      type: String,
      required: true,
      description: `${description} (array of non-empty strings)`
    })(target, propertyKey);

    IsArray()(target, propertyKey);
    Type(() => String)(target, propertyKey);
    IsString({ each: true })(target, propertyKey);
    IsNotEmpty({ each: true })(target, propertyKey);
  };
}

export default RequiredStringArray;
