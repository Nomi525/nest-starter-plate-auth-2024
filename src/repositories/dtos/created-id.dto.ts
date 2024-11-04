import UuidProperty from "../../../common/utils/annotations/dto/uuid.property";

export class CreatedIdDto {
  @UuidProperty("fresh Object ID", true)
  readonly id: string;
}
