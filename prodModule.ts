import { BullModule } from "@nestjs/bull";
import { Logger, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientConfigModule } from "client-config/client-config.module";
import { CoreModule } from "core/core.module";

@Module({
  imports: [
    CoreModule,
    // ClientConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST"),
          port: Number(configService.get("REDIS_PORT")),
          username: configService.get("REDIS_USERNAME"),
          password: configService.get("REDIS_PASSWORD")
        }
      }),
      inject: [ConfigService]
    })
    // NftModule
  ],
  controllers: [],
  providers: [Logger]
})
export class ProdModule implements NestModule {
  configure() {}
}
