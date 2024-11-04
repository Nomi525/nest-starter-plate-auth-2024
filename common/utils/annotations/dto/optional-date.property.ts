import { IsDate, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export function OptionalDateProperty(description: string) {
  return function (object: object, propertyName: string) {
    ApiProperty({
      type: "string",
      format: "date-time",
      required: false,
      description
    })(object, propertyName);
    IsOptional()(object, propertyName);
    IsDate()(object, propertyName);
  };
}
