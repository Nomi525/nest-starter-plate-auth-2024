import RequiredNumberProperty from "../../../../../common/utils/annotations/dto/required-number.property";
import RequiredStringProperty from "../../../../../common/utils/annotations/dto/required-string.property";

export class CreateBreakDto {
  @RequiredStringProperty("employee id")
  employeeId: string;

  @RequiredNumberProperty("break duration")
  duration: number;
}

export class BreakDto extends CreateBreakDto {
  @RequiredStringProperty("break id")
  id: string;
}
