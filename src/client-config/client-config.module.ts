import { Module } from "@nestjs/common";
import { ClientConfigController } from "./client-config.controller";
// import { PriceModule } from "@modules/price/price.module";

@Module({
  controllers: [ClientConfigController],
  // imports: [PriceModule],
  imports: [],
  providers: []
})
export class ClientConfigModule {}
