import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "repositories/prisma.service";
import { BreakDto, CreateBreakDto } from "./dto/create-break.dto";
import { UpdateBreakDto } from "./dto/update-break.dto";

@Injectable()
export class BreakService {
  constructor(private prisma: PrismaService) {}

  async createBreak(createBreakDto: CreateBreakDto): Promise<BreakDto> {

     // Get current time
     const startTime = new Date();

     // Calculate the end time by adding the duration in minutes
     const endTime = new Date(startTime.getTime() + createBreakDto.duration * 60000);  // duration in minutes
 
    return await this.prisma.break.create({
      data: {
        employeeId: createBreakDto.employeeId,
        startTime: startTime,
        endTime: endTime,
        duration: createBreakDto.duration,  // Store duration in minutes
      }
    });
  }

  // async checkBreakExistsOrNot(employeeId: string): Promise<BreakDto | null> {
  //   return await this.prisma.break.findFirst({
  //     where: { employeeId: employeeId }
  //   });
  // }

  async findAllBreak(): Promise<BreakDto[]> {
    return await this.prisma.break.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findAllBreakByEmployee(employeeId: string): Promise<BreakDto[]> {
    return await this.prisma.break.findMany({
      where: {
        employeeId: employeeId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async updateBreak(id: string, updateBreakDto: UpdateBreakDto): Promise<BreakDto> {
    const existingBreak = await this.prisma.break.findFirst({
      where: {
        employeeId: updateBreakDto.employeeId,
        NOT: { id: id }
      }
    });

    if (!existingBreak) {
      throw new BadRequestException("Break already exists");
    }

    return await this.prisma.break.update({
      where: { id: id },
      data: updateBreakDto
    });
  }

  async removeBreak(id: string): Promise<BreakDto> {
    return await this.prisma.break.delete({
      where: { id: id },
    });
  }
}
