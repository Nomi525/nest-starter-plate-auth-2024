import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

function RequiredBooleanProperty(description: string) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: "boolean", required: true, description })(target, propertyKey);
    IsBoolean()(target, propertyKey);
  };
}
export default RequiredBooleanProperty;
