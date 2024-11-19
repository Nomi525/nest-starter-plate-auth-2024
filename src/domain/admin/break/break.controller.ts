import { BadRequestException, Body, Catch, ConflictException, Controller, Param } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { PrivateDeleteRequest } from "../../../../common/utils/annotations/controllers/private-delete-request";
import { PublicGetRequest } from "../../../../common/utils/annotations/controllers/public-get-request";
import { PublicPostRequest } from "../../../../common/utils/annotations/controllers/public-post-request";
import { BreakDto, CreateBreakDto } from "./dto/create-break.dto";
import { BreakService } from "./break.service";
import { BREAK_RESPONSE } from "./constant/break-response";
import { UpdateBreakDto } from "./dto/update-break.dto";
/*if we add the ability to add new languages to the system, we need to alter the DB model to attach certain categories to users, or make them partially visiable*/
@ApiTags("break")
@Catch()
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse()
@Controller("break")
export class BreakController {
  constructor(private readonly breakService: BreakService) {}

  @PublicPostRequest("add", CreateBreakDto, BreakDto, "Endpoint for creating break")
  async create(@Body() createBreakDto: CreateBreakDto): Promise<BreakDto> {

    if (createBreakDto.duration <= 0 || !Number.isInteger(createBreakDto.duration)) {
      throw new BadRequestException('Duration must be a positive integer representing minutes.');
    }
    return await this.breakService.createBreak(createBreakDto);
  }

  @PublicGetRequest("all", [BreakDto], "Listing of languages")
  async findAll(): Promise<BreakDto[]> {
    return await this.breakService.findAllBreak();
  }

  @PublicPostRequest("update/:id", UpdateBreakDto, BreakDto, "update a language")
  async update(@Param("id") id: string, @Body() updateBreakDto: UpdateBreakDto): Promise<void> {
    await this.breakService.updateBreak(id, updateBreakDto);
  }

  @PrivateDeleteRequest("delete/:id", null, "deletes a break", UserRole.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    await this.breakService.removeBreak(id);
  }
}
