import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

function RequiredStringProperty(description: string) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: "string", required: true, description })(target, propertyKey);
    IsString()(target, propertyKey);
    IsNotEmpty()(target, propertyKey);
  };
}

export default RequiredStringProperty;
