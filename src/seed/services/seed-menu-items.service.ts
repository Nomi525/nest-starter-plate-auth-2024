// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "@modules/repositories/prisma.service";

// @Injectable()
// export class SeedMenuItemsService {
//   private readonly logger = new Logger(SeedMenuItemsService.name);

//   constructor(private readonly prismaService: PrismaService) {}

//   async createOrUpdateMenuItem(
//     vendorId: string,
//     categoryId: string,
//     name: string,
//     description: string,
//     priceCents: number
//   ) {
//     let menuItem = await this.prismaService.menuItem.findFirst({
//       where: {
//         name: name,
//         vendor_id: vendorId,
//         categoryId: categoryId
//       }
//     });

//     if (!menuItem) {
//       menuItem = await this.prismaService.menuItem.create({
//         data: {
//           name,
//           description,
//           priceCents,
//           vendor_id: vendorId,
//           categoryId,
//           created_at: new Date(),
//           updated_at: new Date()
//         }
//       });
//       this.logger.log(`Menu item '${name}' created for vendor '${vendorId}'.`);
//     } else {
//       this.logger.log(`Menu item '${name}' already exists for vendor '${vendorId}'.`);
//     }

//     return menuItem;
//   }

//   async execute(): Promise<void> {
//     try {
//       const vendors = await this.prismaService.vendor.findMany();

//       for (const vendor of vendors) {
//         const drinksCategory = await this.prismaService.category.findFirst({ where: { category_name: "Drinks" } });
//         const snacksCategory = await this.prismaService.category.findFirst({ where: { category_name: "Snacks" } });
//         const mainCategory = await this.prismaService.category.findFirst({ where: { category_name: "Main" } });

//         if (drinksCategory && snacksCategory && mainCategory) {
//           await this.createOrUpdateMenuItem(vendor.id, drinksCategory.id, "Cola", "Chilled refreshing cola", 150);
//           await this.createOrUpdateMenuItem(
//             vendor.id,
//             drinksCategory.id,
//             "Orange Juice",
//             "Freshly squeezed orange juice",
//             300
//           );
//           await this.createOrUpdateMenuItem(vendor.id, snacksCategory.id, "Chips", "Crispy potato chips", 100);
//           await this.createOrUpdateMenuItem(vendor.id, snacksCategory.id, "Chocolate Bar", "Rich dark chocolate", 200);
//           await this.createOrUpdateMenuItem(vendor.id, mainCategory.id, "Burger", "Juicy grilled beef burger", 800);
//           await this.createOrUpdateMenuItem(vendor.id, mainCategory.id, "Pizza", "Wood-fired margherita pizza", 1200);
//         } else {
//           this.logger.error("One or more categories not found.");
//         }
//       }

//       this.logger.log("Menu items seeded successfully.");
//     } catch (error) {
//       this.logger.error("Error occurred during menu item seeding:", error);
//       throw error;
//     }
//   }
// }
