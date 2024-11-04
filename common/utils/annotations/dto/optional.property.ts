import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

function OptionalProperty(description: string) {
  return function (target: object, propertyName: string) {
    const propertyType = Reflect.getMetadata("design:type", target, propertyName);

    if (propertyType === Array) {
      throw new Error("not implemented, please add a @OptionalArrayProperty");
    } else {
      ApiProperty({
        required: false,
        description: description
      })(target, propertyName);
      IsOptional()(target, propertyName);
      IsObject()(target, propertyName);
    }
  };
}

export default OptionalProperty;
