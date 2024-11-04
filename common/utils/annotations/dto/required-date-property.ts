import { IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export function RequiredDateProperty(description: string) {
  return function (object: object, propertyName: string) {
    ApiProperty({
      type: "string",
      format: "date-time",
      required: true,
      description
    })(object, propertyName);
    IsDate()(object, propertyName);
  };
}
export default RequiredDateProperty;
