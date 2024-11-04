import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    super({
      log: [
        {
          emit: "event",
          level: "query"
        },
        {
          emit: "event",
          level: "info"
        },
        {
          emit: "event",
          level: "warn"
        },
        {
          emit: "event",
          level: "error"
        }
      ]
    });
    const logsqldebug = config.get("LOG_SQL_DEBUG", "false") === "true";
    if (logsqldebug) {
      // Set up the query event listener with explicit type annotation
      this.$on("query" as never, (e: Prisma.QueryEvent) => {
        this.logger.verbose(`Query: ${e.query}`);
        this.logger.verbose(`Params: ${e.params}`);
        this.logger.verbose(`Duration: ${e.duration}ms`);
      });

      // Set up additional event listeners if needed
      this.$on("info" as never, (e: Prisma.LogEvent) => {
        this.logger.log(`Info: ${e.message}`);
      });

      this.$on("warn" as never, (e: Prisma.LogEvent) => {
        this.logger.warn(`Warning: ${e.message}`);
      });

      this.$on("error" as never, (e: Prisma.LogEvent) => {
        this.logger.error(`Error: ${e.message}`);
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("PrismaService connected to the database");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("PrismaService disconnected from the database");
  }
}
