// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "@modules/repositories/prisma.service";
// import { UserRole } from "@prisma/client";
// import { cheddrHash, createRandomUIWallet, encryptWithAES, generateSHA256Hash } from "@common/utils/crypto-utils";
// import { SeedUtils } from "@modules/seed/utils/seed-utils";

// @Injectable()
// export class EnsureVendorsService {
//   private readonly logger = new Logger(EnsureVendorsService.name);

//   constructor(
//     private readonly prismaService: PrismaService,
//     private readonly seedUtils: SeedUtils
//   ) {}

//   async execute(): Promise<void> {
//     const users: Array<{ vendor: string; password: string; email: string }> = [
//       {
//         email: "noman1@yopmail.com",
//         password: "Admin@123",
//         vendor: "Street Feast Express"
//       },
//       {
//         email: "himanshu1@yopmail.com",
//         password: "Admin@123",
//         vendor: "Flavor Wheels"
//       },
//       {
//         email: "prakash1@yopmail.com",
//         password: "Admin@123",
//         vendor: "Urban Eats Cruiser"
//       }
//     ];

//     for (const userData of users) {
//       try {
//         // Hash and encryption logic
//         const rootPwHash = await cheddrHash(userData.email, userData.password);
//         const authHash = generateSHA256Hash("auth" + rootPwHash);
//         const lowEntropyHash = generateSHA256Hash("leh" + rootPwHash);

//         // Create a random EOA wallet
//         const CreateWallet = await createRandomUIWallet();
//         const seedphrase = CreateWallet?.seedPhrase ?? "";
//         const serverSalt = encryptWithAES(seedphrase, lowEntropyHash);

//         // Create or update user
//         const user = await this.seedUtils.createOrUpdateUser(userData.email, authHash, UserRole.Vendor);

//         // Create or update vendor
//         await this.seedUtils.createOrUpdateVendor(user.id, userData.vendor);

//         // Deploy Safe Wallet for user
//         await this.seedUtils.deploySafeWalletForUser(user, CreateWallet.address, serverSalt);
//       } catch (error) {
//         this.logger.error(`Error occurred for user ${userData.email}:`, error);

//         // Rollback logic for the user
//         try {
//           await this.prismaService.$transaction(async tx => {
//             await tx.safeWallet.deleteMany({ where: { user_id: userData.email } });
//             await tx.vendor.deleteMany({ where: { user_id: userData.email } });
//             await tx.user.delete({ where: { email: userData.email } });
//           });
//         } catch (rollbackError) {
//           this.logger.error(`Rollback error for user ${userData.email}:`, rollbackError);
//         }
//       }
//     }

//     await this.prismaService.$disconnect();
//   }
// }
