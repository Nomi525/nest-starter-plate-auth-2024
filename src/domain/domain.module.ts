import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TaskModule } from "./task/task.module";
import { RouteInfo } from "@nestjs/common/interfaces";
import { UserModule } from "./user/user.module";
import { AuthModule } from "auth/auth.module";
import { setupSwagger } from "../../middlewares/setupSwagger";

@Module({
  // imports: [TaskModule, UserModule],
  imports: [AuthModule],
  controllers: [],
  providers: []
})
export class DomainModule {
  public privateRouters: Array<RouteInfo> = [
    {
      path: "/api/v1/tasks",
      method: RequestMethod.ALL
    },
    {
      path: "/api/v1/tasks/*",
      method: RequestMethod.ALL
    }
  ];
  public publicRouter: Array<RouteInfo> = [
    {
      path: "/api/v1/users",
      method: RequestMethod.ALL
    }
  ];

  public configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(setupSwagger(""))
    //   .exclude(...this.publicRouter)
    //   .forRoutes(...this.privateRouters);
  }
}
