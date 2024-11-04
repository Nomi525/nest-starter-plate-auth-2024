import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

function UuidProperty(description: string, required?: boolean) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: "string", required: required, description })(target, propertyKey);
    IsUUID()(target, propertyKey);
    if (required) {
      IsNotEmpty()(target, propertyKey);
    } else {
      IsOptional()(target, propertyKey);
    }
  };
}

export default UuidProperty;
