import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

// helper annotation to keep enums compact
export function EnumProperty(enumClass: object, description: string, optional?: boolean) {
  const apiPropertyDecorator = ApiProperty({
    enum: Object.values(enumClass),
    required: !optional,
    description: `${description} (one of ${Object.values(enumClass).join(", ")})`
    // example: Object.values(enumClass)[0]
  });

  const isEnumDecorator = IsEnum(enumClass);
  const isOptionalDecorator = IsOptional();

  return (target: object, propertyKey: string): void => {
    apiPropertyDecorator(target, propertyKey);
    isEnumDecorator(target, propertyKey);
    if (optional) {
      isOptionalDecorator(target, propertyKey);
    }
  };
}
export default EnumProperty;
