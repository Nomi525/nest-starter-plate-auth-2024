import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { TimeoutInterceptor, TransformInterceptor } from "../../common/interceptors";
import { NonHttpErrorFilter } from "../../common/filters";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    })
  ],
  exports: [ConfigModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: NonHttpErrorFilter
    }
  ]
})
export class CoreModule {}
