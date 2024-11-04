// import { Injectable, Logger } from "@nestjs/common";
// import { Category } from "@prisma/client";
// import { PrismaService } from "@modules/repositories/prisma.service";

// @Injectable()
// export class EnsureCategoriesService {
//   private readonly logger = new Logger(EnsureCategoriesService.name);

//   constructor(private readonly prisma: PrismaService) {}

//   async createOrUpdateCategory(categoryName: string): Promise<Category> {
//     let category = await this.prisma.category.findFirst({
//       where: { category_name: categoryName }
//     });

//     if (!category) {
//       category = await this.prisma.category.create({
//         data: {
//           category_name: categoryName,
//           created_at: new Date(),
//           updated_at: new Date(),
//           deleted: false
//         }
//       });
//       this.logger.log(`Category '${categoryName}' created.`);
//     }

//     return category;
//   }

//   async execute(): Promise<void> {
//     try {
//       await this.createOrUpdateCategory("Drinks");
//       await this.createOrUpdateCategory("Snacks");
//       await this.createOrUpdateCategory("Main");
//       this.logger.log("Categories ensured successfully.");
//     } catch (error) {
//       this.logger.error("Error occurred during category seeding:", error);
//       throw error;
//     }
//   }
// }
