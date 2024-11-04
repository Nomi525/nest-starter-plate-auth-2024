import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

function OptionalBooleanProperty(description: string) {
  return function (target: object, propertyKey: string) {
    ApiPropertyOptional({ type: "boolean", description })(target, propertyKey);
    IsOptional()(target, propertyKey);
    IsBoolean()(target, propertyKey);
  };
}

export default OptionalBooleanProperty;
