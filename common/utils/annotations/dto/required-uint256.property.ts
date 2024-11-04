import { ApiProperty } from "@nestjs/swagger";
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsString
} from "class-validator";

// Custom validator to check if a string represents a valid uint256
@ValidatorConstraint({ async: false })
class IsUint256Constraint implements ValidatorConstraintInterface {
  validate(value: string) {
    // Check if the string is a valid uint256
    const uint256Regex = /^(0|[1-9]\d*)$/;
    try {
      // Convert to BigInt to check if it fits in uint256 range
      const bigIntValue = BigInt(value);
      return uint256Regex.test(value) && bigIntValue >= 0n && bigIntValue <= 2n ** 256n - 1n;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a string representing a uint256 value.`;
  }
}

function RequiredUint256Property(description: string, validationOptions?: ValidationOptions) {
  return function (target: object, propertyKey: string) {
    ApiProperty({ type: "string", required: true, description })(target, propertyKey);

    IsString()(target, propertyKey); // Ensure the property is a string

    registerDecorator({
      name: "isUint256",
      target: target.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      validator: IsUint256Constraint
    });
  };
}

export default RequiredUint256Property;
