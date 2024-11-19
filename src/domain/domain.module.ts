import { Module } from "@nestjs/common";
import { LanguageModule } from "./admin/language/language.module";
import { BreakModule } from "./admin/break/break.module";

@Module({
  imports: [LanguageModule, BreakModule],
  providers: [],
  exports: []
})
export class DomainModule {
  // public privateRouters: Array<RouteInfo> = [
  //   {
  //     path: "/api/v1/tasks",
  //     method: RequestMethod.ALL
  //   },
  //   {
  //     path: "/api/v1/tasks/*",
  //     method: RequestMethod.ALL
  //   }
  // ];
  // public publicRouter: Array<RouteInfo> = [
  //   {
  //     path: "/api/v1/users",
  //     method: RequestMethod.ALL
  //   }
  // ];
  // public configure(consumer: MiddlewareConsumer) {
  //   // consumer
  //   //   .apply(setupSwagger(""))
  //   //   .exclude(...this.publicRouter)
  //   //   .forRoutes(...this.privateRouters);
  // }
}
