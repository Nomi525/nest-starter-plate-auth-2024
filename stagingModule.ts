import { BullModule } from "@nestjs/bull";
import { Logger, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppController } from "app.controller";
import { AppService } from "app.service";
import { AuthModule } from "auth/auth.module";
import { UserFacingAuthModule } from "auth/user-facing-auth.module";
import { ClientConfigModule } from "client-config/client-config.module";
import { CoreModule } from "core/core.module";
import { DomainModule } from "domain/domain.module";
import { EmailModule } from "email/email.module";
import { FilesModule } from "file/file.module";
import { join } from "path";
import { RedisModule } from "redis/redis.module";
import { RepositoriesModule } from "repositories";
import { WebsocketModule } from "websocket/websocket.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "upload/files/public"),
      serveRoot: "/image", // URL prefix to serve the static files
      serveStaticOptions: { index: false }
    }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get("REDIS_HOST"),
    //       port: parseInt(configService.get("REDIS_PORT")!, 10),
    //       // username: configService.get("REDIS_USERNAME"),
    //       // password: configService.get("REDIS_PASSWORD")
    //     }
    //   }),
    //   inject: [ConfigService]
    // }),
    RepositoriesModule,
    CoreModule,
    RedisModule,
    ClientConfigModule,
    UserFacingAuthModule
    // WebsocketModule,
    // AuthModule
    // EmailModule,
    // FilesModule,
    // DomainModule,
    // PreferencesModule,
    // CheddrNotificationModule,
    // UserFacingAuthModule,
    // BlockchainModule,
    // WalletModule,
    // OnrampModule,
    // SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger]
})
export class StagingModule implements NestModule {
  configure(/*consumer: MiddlewareConsumer*/) {}
}
