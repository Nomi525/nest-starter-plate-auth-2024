import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";

function RequiredProperty(description: string) {
  return function (target: object, propertyName: string) {
    const propertyType = Reflect.getMetadata("design:type", target, propertyName);

    if (propertyType === Array) {
      throw new Error("use @RequiredArrayProperty instead");
    } else {
      ApiProperty({
        required: true,
        description: description
      })(target, propertyName);
      IsObject()(target, propertyName);
    }
  };
}
export default RequiredProperty;
