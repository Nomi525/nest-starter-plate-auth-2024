import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
// import { SeedModule } from "@modules/seed/seed.module"; // Assuming this is the Prisma service

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST"),
          port: Number(configService.get("REDIS_PORT")),
          username: configService.get("REDIS_USERNAME"),
          password: configService.get("REDIS_PASSWORD")
        }
      }),
      inject: [ConfigService]
    }),
    // SeedModule
  ],
  providers: [],
  exports: []
})
export class PrismaSeedModule {}
