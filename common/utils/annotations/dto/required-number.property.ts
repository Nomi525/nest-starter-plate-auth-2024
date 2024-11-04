import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

function RequiredNumberProperty(description: string) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: "number", required: true, description })(target, propertyKey);
    IsInt()(target, propertyKey);
  };
}

export default RequiredNumberProperty;
