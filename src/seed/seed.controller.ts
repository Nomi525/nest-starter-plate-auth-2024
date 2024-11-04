// import { Controller, Logger } from "@nestjs/common";
// import { ApiTags } from "@nestjs/swagger";
// import { PrivatePostRequest } from "@common/utils/annotations/controllers/private-post-request";
// import { UserRole } from "@prisma/client";
// import { EnsureEmployeeService } from "@modules/seed/services/ensure-employee.service";
// import { EnsureVendorsService } from "@modules/seed/services/ensure-vendors.service";
// import { EnsureCategoriesService } from "@modules/seed/services/ensure-categories.service";
// import { SeedOpenChannelService } from "@modules/seed/services/seed-open-channel.service";
// import { SeedMenuItemsService } from "@modules/seed/services/seed-menu-items.service";
// import { RedeployMissingSafeService } from "@modules/seed/services/redeploy-missing-safe.service";
// import { SyncChannelsService } from "@modules/seed/services/sync-channels.service";

// @ApiTags("seed")
// @Controller("seed")
// /*these methods are kicking off processes that are supposed to run for a few seconds/minutes. therefore we are not blocking the http requests and are not returning any data*/
// export class SeedController {
//   private readonly logger = new Logger(SeedController.name);

//   constructor(
//     private readonly ensureEmployeeService: EnsureEmployeeService,
//     private readonly ensureVendorsService: EnsureVendorsService,
//     private readonly seedOpenChannelService: SeedOpenChannelService,
//     private readonly ensureCategoriesService: EnsureCategoriesService,
//     private readonly seedMenuItemsService: SeedMenuItemsService,
//     private readonly redeployMissingSafeService: RedeployMissingSafeService,
//     private readonly syncChannelsService: SyncChannelsService
//   ) {}

//   // Helper method to measure execution time
//   private async measureExecutionTime(taskName: string, task: () => Promise<void>): Promise<void> {
//     const start = Date.now();
//     this.logger.log(`Starting ${taskName} process...`);

//     task().finally(() => {
//       const duration = Date.now() - start;
//       this.logger.log(`Finished ${taskName} process in ${duration}ms.`);
//     });

//     return Promise.resolve();
//   }

//   @PrivatePostRequest("1_categories", null, null, "Seeds the categories data", UserRole.Admin)
//   async seedCategories(): Promise<void> {
//     return this.measureExecutionTime("seedCategories", () => this.ensureCategoriesService.execute());
//   }

//   @PrivatePostRequest("2_vendors", null, null, "Seeds the vendor data", UserRole.Admin)
//   async seedVendors(): Promise<void> {
//     return this.measureExecutionTime("seedVendors", () => this.ensureVendorsService.execute());
//   }

//   @PrivatePostRequest("3_menu-items", null, null, "Seeds the menu items data", UserRole.Admin)
//   async seedMenuItems(): Promise<void> {
//     return this.measureExecutionTime("seedMenuItems", () => this.seedMenuItemsService.execute());
//   }

//   @PrivatePostRequest("4_employee", null, null, "Seeds the employee data", UserRole.Admin)
//   async seedEmployee(): Promise<void> {
//     return this.measureExecutionTime("seedEmployee", () => this.ensureEmployeeService.execute());
//   }

//   @PrivatePostRequest("5_open-channel", null, null, "Seeds the open channel data", UserRole.Admin)
//   async seedOpenChannel(): Promise<void> {
//     return this.measureExecutionTime("seedOpenChannel", () => this.seedOpenChannelService.execute());
//   }

//   @PrivatePostRequest("6_redeploy_missing_safe", null, null, "Redeploys missing safe wallets", UserRole.Admin)
//   async seedRedeployMissingSafe(): Promise<void> {
//     return this.measureExecutionTime("seedRedeployMissingSafe", () => this.redeployMissingSafeService.execute());
//   }

//   @PrivatePostRequest("7_sync-channels", null, null, "Syncs the DB with on-chain channels", UserRole.Admin)
//   async syncChannels(): Promise<void> {
//     return this.measureExecutionTime("syncChannels", () => this.syncChannelsService.execute());
//   }
// }
