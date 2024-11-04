import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@ValidatorConstraint({ async: false })
class IsOptionalOrFixedHexStringConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const [expectedLength] = args.constraints;
    if (value === undefined || value === null) {
      return true;
    }
    if (typeof value !== "string") {
      return false;
    }
    return value.length === expectedLength && /^([0-9A-F]{2})+$/.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a hexadecimal string of length ${args.constraints[0]} with all characters uppercase.`;
  }
}

export function IsFixedHexString(
  length: number,
  description: string,
  validationOptions?: ValidationOptions & { optional?: boolean }
) {
  return function (object: object, propertyName: string) {
    ApiProperty({
      type: "string",
      required: !validationOptions?.optional,
      description
    })(object, propertyName);

    registerDecorator({
      name: "isOptionalOrFixedHexString",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [length],
      options: validationOptions,
      validator: IsOptionalOrFixedHexStringConstraint
    });
  };
}
