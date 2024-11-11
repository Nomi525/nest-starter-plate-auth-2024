import { Module } from "@nestjs/common";
import { ClientConfigController } from "./client-config.controller";
// import { PriceModule } from "@modules/price/price.module";

@Module({
  // imports: [PriceModule],
  imports: [],
  controllers: [ClientConfigController],
  providers: [],
  exports: []
})
export class ClientConfigModule {}
