import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module";
import { AuthController } from "./auth.controller";
// import { BlockchainModule } from "modules/blockchain/blockchain.module";
import { WebsocketModule } from "../websocket/websocket.module";
import { AuthService } from "../auth/services/auth.service";
import { AuthModule } from "../auth/auth.module";
import { RepositoriesModule } from "repositories/repositories.module";
// import { VendorModule } from "@modules/vendors/vendor.module";

@Module({
  controllers: [AuthController],
  imports: [RepositoriesModule, WebsocketModule, AuthModule, EmailModule,],
  exports: [AuthService],
  providers: [AuthService]
})
export class UserFacingAuthModule {}
