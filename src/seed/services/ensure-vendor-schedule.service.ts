// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "@modules/repositories/prisma.service";
// import { VendorSchedule, Weekday } from "@prisma/client";
// import { VendorScheduleDto } from "modules/vendor-schedule/dto/create-vendor-schedule-dto";

// @Injectable()
// export class VendorScheduleSeedService {
//   private readonly logger = new Logger(VendorScheduleSeedService.name);

//   constructor(private readonly prismaService: PrismaService) {}

//   async createOrUpdateVendorSchedule(
//     vendorId: string,
//     startTime: string,
//     endTime: string,
//     active_days: Weekday[],
//     company_name: string,
//     address: string,
//     active: boolean
//   ) {
//     const vendor = await this.prismaService.vendor.findUnique({
//       where: { id: vendorId }
//     });

//     if (!vendor) {
//       throw new Error(`Vendor not found with id: ${vendorId}`);
//     }
//     const existingSchedules = await this.prismaService.vendorSchedule.findMany({
//       where: {
//         vendorId,
//         startTime,
//         endTime
//       }
//     });

//     const processedDays = new Set<string>();
//     for (const schedule of existingSchedules) {
//       const scheduleActiveDays = schedule.active_days as Weekday[];

//       for (const day of scheduleActiveDays) {
//         if (active_days.includes(day)) {
//           if (processedDays.has(day)) {
//             throw new Error(`The time slot for ${day} already exists. Please change the time.`);
//           }

//           await this.prismaService.vendorSchedule.update({
//             where: { id: schedule.id },
//             data: {
//               startTime,
//               endTime,
//               company_name,
//               address,
//               active,
//               updated_at: new Date()
//             }
//           });
//           processedDays.add(day);
//         } else {
//           await this.prismaService.vendorSchedule.delete({
//             where: { id: schedule.id }
//           });
//         }
//       }
//     }
//     for (const day of active_days) {
//       if (!processedDays.has(day)) {
//         const conflictingSchedule = await this.prismaService.vendorSchedule.findFirst({
//           where: {
//             vendorId,
//             startTime,
//             endTime,
//             active_days: {
//               has: day
//             }
//           }
//         });

//         if (conflictingSchedule) {
//           throw new Error(`The time slot for ${day} already exists. Please change the time.`);
//         }

//         const newSchedule = await this.prismaService.vendorSchedule.create({
//           data: {
//             vendorId,
//             startTime,
//             endTime,
//             active_days: [day],
//             company_name,
//             address,
//             active: true
//           }
//         });
//       }
//     }
//   }

//   async execute(): Promise<void> {
//     try {
//       const vendors = await this.prismaService.vendor.findMany();

//       for (const vendor of vendors) {
//         await this.createOrUpdateVendorSchedule(vendor.id, "12:15", "13:30", ["SUN"], "Cheddr", "Ahmedabad", true);
//         await this.createOrUpdateVendorSchedule(vendor.id, "12:15", "13:30", ["MON"], "Cheddr", "Ahmedabad", true);
//         await this.createOrUpdateVendorSchedule(vendor.id, "12:15", "13:30", ["TUE"], "Cheddr", "Ahmedabad", true);
//         await this.createOrUpdateVendorSchedule(vendor.id, "14:45", "19:30", ["WED"], "Cheddr One", "Surat", true);
//         await this.createOrUpdateVendorSchedule(vendor.id, "14:45", "19:30", ["SAT"], "Cheddr One", "Surat", true);
//         await this.createOrUpdateVendorSchedule(
//           vendor.id,
//           "08:00",
//           "10:15",
//           ["SAT"],
//           "Cheddr Two",
//           "GandhiNagar",
//           true
//         );
//       }
//       this.logger.log("Vendor schedules are seeded successfully.");
//     } catch (error) {
//       this.logger.error("Error occurred during vendor schedule seeding:", error);
//       throw error;
//     }
//   }
// }
