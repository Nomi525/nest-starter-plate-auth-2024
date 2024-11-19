import { Module } from "@nestjs/common";
import { PrismaService } from "repositories/prisma.service";
import { BreakController } from "./break.controller";
import { BreakService } from "./break.service";

@Module({
  controllers: [BreakController],
  providers: [PrismaService, BreakService]
})
export class BreakModule {}
