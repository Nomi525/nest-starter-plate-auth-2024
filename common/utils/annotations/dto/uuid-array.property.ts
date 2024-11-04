import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID, ArrayNotEmpty, ArrayUnique } from "class-validator";

function UuidArrayProperty(description: string, required?: boolean) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: [String], required: required, description })(target, propertyKey);
    ArrayNotEmpty()(target, propertyKey);
    ArrayUnique()(target, propertyKey);
    IsUUID(4, { each: true })(target, propertyKey); // Validate each item in the array
    if (required) {
      IsNotEmpty()(target, propertyKey);
    } else {
      IsOptional()(target, propertyKey);
    }
  };
}

export default UuidArrayProperty;
