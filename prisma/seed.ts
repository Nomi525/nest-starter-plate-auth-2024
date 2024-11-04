// import { NestFactory } from "@nestjs/core";

// import { EnsureCategoriesService } from "@modules/seed/services/ensure-categories.service";
// import { EnsureEmployeeService } from "@modules/seed/services/ensure-employee.service";
// import { EnsureVendorsService } from "@modules/seed/services/ensure-vendors.service";
// import { SeedOpenChannelService } from "@modules/seed/services/seed-open-channel.service";
// import { SeedMenuItemsService } from "@modules/seed/services/seed-menu-items.service";
// import { PrismaSeedModule } from "./seed/prismaSeed.module";
// import { SyncChannelsService } from "@modules/seed/services/sync-channels.service";
// import { VendorScheduleSeedService } from "modules/seed/services/ensure-vendor-schedule.service";

// async function main() {
//   const app = await NestFactory.createApplicationContext(PrismaSeedModule);

//   const ensureCategoriesService = app.get(EnsureCategoriesService);
//   const ensureEmployeeService = app.get(EnsureEmployeeService);
//   const ensureVendorsService = app.get(EnsureVendorsService);
//   const seedMenuItemsService = app.get(SeedMenuItemsService);
//   const seedOpenChannelService = app.get(SeedOpenChannelService);
//   const syncChannelsService = app.get(SyncChannelsService);
//   const ensureVendorScheduleService = app.get(VendorScheduleSeedService)

//   await ensureCategoriesService.execute();
//   await ensureEmployeeService.execute();
//   await ensureVendorsService.execute();
//   await syncChannelsService.execute();
//   await seedMenuItemsService.execute();
//   await seedOpenChannelService.execute();
//   await ensureVendorScheduleService.execute();

//   await app.close();
// }

// main()
//   .then(() => {
//     console.log("Seeding completed successfully.");
//     process.exit(0);
//   })
//   .catch(async e => {
//     console.error("Seeding failed.", e);
//     process.exit(1);
//   });
