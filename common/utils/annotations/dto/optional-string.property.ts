import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

// helper annotation to keep enums compact
function OptionalStringProperty(description: string) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: "string", required: false, description })(target, propertyKey);
    IsOptional()(target, propertyKey);
    IsString()(target, propertyKey);
  };
}

export default OptionalStringProperty;
