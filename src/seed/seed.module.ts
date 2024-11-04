// import { Module } from "@nestjs/common";
// import { EnsureCategoriesService } from "./services/ensure-categories.service";
// import { EnsureEmployeeService } from "./services/ensure-employee.service";
// import { EnsureVendorsService } from "./services/ensure-vendors.service";
// import { SeedOpenChannelService } from "./services/seed-open-channel.service";
// import { SeedMenuItemsService } from "./services/seed-menu-items.service";
// import { RepositoriesModule } from "@modules/repositories";
// import { BlockchainModule } from "@modules/blockchain/blockchain.module";
// import { SequencerModule } from "@modules/sequencer/sequencer.module";
// import { SeedController } from "@modules/seed/seed.controller";
// import { SeedUtils } from "@modules/seed/utils/seed-utils";
// import { AdminUserService } from "@modules/seed/services/admin-create.service";
// import { RedeployMissingSafeService } from "@modules/seed/services/redeploy-missing-safe.service";
// import { SyncChannelsService } from "@modules/seed/services/sync-channels.service";
// import { VendorScheduleSeedService } from "./services/ensure-vendor-schedule.service";

// @Module({
//   imports: [RepositoriesModule, BlockchainModule, SequencerModule],
//   controllers: [SeedController],
//   providers: [
//     EnsureCategoriesService,
//     EnsureEmployeeService,
//     EnsureVendorsService,
//     SeedOpenChannelService,
//     SeedMenuItemsService,
//     SeedUtils,
//     AdminUserService,
//     RedeployMissingSafeService,
//     SyncChannelsService,
//     VendorScheduleSeedService,
//   ],
//   exports: [
//     EnsureCategoriesService,
//     EnsureEmployeeService,
//     EnsureVendorsService,
//     SeedOpenChannelService,
//     SeedMenuItemsService
//   ]
// })
// export class SeedModule {}
