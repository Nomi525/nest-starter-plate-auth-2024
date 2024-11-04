import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

function RequiredEmailProperty(description: string) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: "string", required: true, description })(target, propertyKey);
    IsNotEmpty()(target, propertyKey);
    IsString()(target, propertyKey);
    IsEmail()(target, propertyKey);
  };
}

export default RequiredEmailProperty;
