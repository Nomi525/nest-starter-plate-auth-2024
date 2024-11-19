import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "repositories/prisma.service";
import { CreateLanguageDto, LanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  async createLanguage(createLanguageDto: CreateLanguageDto): Promise<LanguageDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.language.create({
      data: {
        name:  createLanguageDto.name
      }
    });
  }

  async checkLanguageExistsOrNot(languageName: string): Promise<LanguageDto | null> {
    return await this.prisma.language.findFirst({
      where: { name: languageName }
    });
  }

  async findAllLanguage(): Promise<LanguageDto[]> {
    return await this.prisma.language.findMany({
      where: {
        isDeleted: false
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async updateLanguage(id: string, updateLanguageDto: UpdateLanguageDto): Promise<LanguageDto> {
    const existingLanguage = await this.prisma.language.findFirst({
      where: {
        name: updateLanguageDto.name,
        NOT: { id: id }
      }
    });

    if (!existingLanguage) {
      throw new BadRequestException("Language already exists");
    }

    return await this.prisma.language.update({
      where: { id: id },
      data: updateLanguageDto
    });
  }

  async removeLanguage(id: string): Promise<LanguageDto> {
    return await this.prisma.language.update({
      where: { id },
      data: { isDeleted: true }
    });
  }
}
