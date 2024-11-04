import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

function OptionalNumberProperty(description: string) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: "number", required: false, description })(target, propertyKey);
    IsOptional()(target, propertyKey);
    IsNumber()(target, propertyKey);
  };
}

export default OptionalNumberProperty;
