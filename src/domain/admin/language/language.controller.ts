import { Body, Catch, ConflictException, Controller, Param } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { LanguageService } from "./language.service";
import { PrivatePostRequest } from "../../../../common/utils/annotations/controllers/private-post-request";
import { CreateLanguageDto, LanguageDto } from "./dto/create-language.dto";
import { UserRole } from "@prisma/client";
import { PublicGetRequest } from "../../../../common/utils/annotations/controllers/public-get-request";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { PrivateDeleteRequest } from "../../../../common/utils/annotations/controllers/private-delete-request";
import { Language_RESPONSE } from "./constant/language-response";
import { PublicPostRequest } from "../../../../common/utils/annotations/controllers/public-post-request";
/*if we add the ability to add new languages to the system, we need to alter the DB model to attach certain categories to users, or make them partially visiable*/
@ApiTags("language")
@Catch()
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse()
@Controller("language")
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @PublicPostRequest("add", CreateLanguageDto, LanguageDto, "Endpoint for creating language")
  async create(@Body() createLanguageDto: CreateLanguageDto): Promise<LanguageDto> {
    const existingLanguage = await this.languageService.checkLanguageExistsOrNot(createLanguageDto.name);
    if (existingLanguage) {
      throw new ConflictException(Language_RESPONSE.Language_ALREADY_EXISTS);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.languageService.createLanguage(createLanguageDto);
  }

  @PublicGetRequest("all", [LanguageDto], "Listing of languages")
  async findAll(): Promise<LanguageDto[]> {
    return await this.languageService.findAllLanguage();
  }

  @PublicPostRequest("update/:id", UpdateLanguageDto, LanguageDto, "update a language")
  async update(@Param("id") id: string, @Body() updateLanguageDto: UpdateLanguageDto): Promise<void> {
    await this.languageService.updateLanguage(id, updateLanguageDto);
  }

  @PrivateDeleteRequest("delete/:id", null, "deletes a language", UserRole.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    await this.languageService.removeLanguage(id);
  }
}
