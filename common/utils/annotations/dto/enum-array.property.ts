import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";

export function EnumArrayProperty(enumClass: object, description: string, options: { required?: boolean } = {}) {
  return (target: object, propertyKey: string): void => {
    const { required = true } = options;

    ApiProperty({
      enum: Object.values(enumClass),
      required,
      description: `${description} (selection of ${Object.values(enumClass).join(", ")})`,
      isArray: true
    })(target, propertyKey);

    if (required) {
      IsArray()(target, propertyKey);
      IsEnum(enumClass, { each: true })(target, propertyKey);
    } else {
      IsOptional()(target, propertyKey);
      IsArray()(target, propertyKey);
      IsEnum(enumClass, {
        each: true,
        message: `Each value in ${propertyKey} must be one of ${Object.values(enumClass).join(", ")}`
      })(target, propertyKey);
    }
  };
}

export default EnumArrayProperty;
