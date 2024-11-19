import RequiredStringProperty from "../../../../../common/utils/annotations/dto/required-string.property";

export class CreateLanguageDto {
  @RequiredStringProperty("language name")
  name: string;
}

export class LanguageDto extends CreateLanguageDto {
  @RequiredStringProperty("language id")
  id: string;
}
