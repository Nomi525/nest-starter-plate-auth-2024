import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import "reflect-metadata";

type Constructor<T> = {
  new (...args: unknown[]): T;
};

function RequiredArrayProperty<T>(itemType: Constructor<T>, description: string) {
  return function (target: object, propertyName: string) {
    ApiProperty({
      type: "array",
      items: { $ref: `#/components/schemas/${itemType.name}` },
      required: true,
      description: description
    })(target, propertyName);

    ApiExtraModels(itemType)(target.constructor);

    IsArray()(target, propertyName);
  };
}

export default RequiredArrayProperty;
