import { PartialType } from "@nestjs/swagger";
import { CreateBreakDto } from "./create-break.dto";

export class UpdateBreakDto extends PartialType(CreateBreakDto) {}
