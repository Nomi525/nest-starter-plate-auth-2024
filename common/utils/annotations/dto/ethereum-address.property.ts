import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { getAddress } from "ethers";

@ValidatorConstraint({ async: false })
class IsEthereumAddressConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (value === undefined || value === null) {
      return true; // Optional validation
    }
    if (typeof value !== "string") {
      return false;
    }
    try {
      // Ethers.js will throw an error if the address is not valid or checksummed
      const checksummedAddress = getAddress(value);
      return value === checksummedAddress;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid and checksummed Ethereum address.`;
  }
}

function EthereumAddress(description: string, validationOptions?: ValidationOptions & { optional?: boolean }) {
  return function (object: object, propertyName: string) {
    ApiProperty({
      type: "string",
      required: !validationOptions?.optional,
      description
    })(object, propertyName);

    registerDecorator({
      name: "isEthereumAddress",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEthereumAddressConstraint
    });
  };
}

export default EthereumAddress;
