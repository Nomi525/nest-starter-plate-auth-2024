// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "@modules/repositories/prisma.service";
// import { SafeWalletDeployService } from "@modules/blockchain/safe-wallet-deploy.service";
// import { User, UserRole, Vendor } from "@prisma/client";
// import { hashPassword } from "@common/utils";

// @Injectable()
// export class SeedUtils {
//   private readonly logger = new Logger(SeedUtils.name);

//   constructor(
//     private readonly prismaService: PrismaService,
//     private readonly safeWalletDeployService: SafeWalletDeployService
//   ) {}

//   async createOrUpdateUser(email: string, authHash: string, role: UserRole): Promise<User> {
//     let user = await this.prismaService.user.findUnique({ where: { email } });
//     const passwordHash = await hashPassword(authHash);

//     if (!user) {
//       user = await this.prismaService.user.create({
//         data: {
//           email,
//           pwd_hash: passwordHash,
//           role,
//           created_at: new Date(),
//           updated_at: new Date()
//         }
//       });
//       this.logger.log(`User ${email} created.`);
//     } else {
//       this.logger.log(`User ${email} already exists.`);
//     }

//     return user;
//   }

//   async createOrUpdateVendor(userId: string, vendorName: string): Promise<Vendor> {
//     let vendor = await this.prismaService.vendor.findFirst({
//       where: { user_id: userId }
//     });

//     if (!vendor) {
//       vendor = await this.prismaService.vendor.create({
//         data: {
//           user_id: userId,
//           name: vendorName,
//           created_at: new Date()
//         }
//       });
//       this.logger.log(`Vendor ${vendorName} created.`);
//     } else {
//       this.logger.log(`Vendor ${vendorName} already exists.`);
//     }

//     return vendor;
//   }

//   async deploySafeWalletForUser(user: User, user_EOA_address: string, serverSalt: string): Promise<string> {
//     try {
//       const safeWalletAddress = await this.safeWalletDeployService.deployWallet(user_EOA_address);

//       if (!safeWalletAddress) {
//         throw new Error(`Failed to create safe wallet for user ${user.email}.`);
//       }

//       await this.prismaService.$transaction(async tx => {
//         let safeWallet = await tx.safeWallet.findFirst({ where: { user_id: user.id } });

//         if (!safeWallet) {
//           safeWallet = await tx.safeWallet.create({
//             data: {
//               server_salt: serverSalt,
//               safeWalletAddress: safeWalletAddress,
//               user_EOA_address: user_EOA_address,
//               user_id: user.id
//             }
//           });
//           this.logger.log(`Safe wallet created for user ${user.email}.`);

//           await tx.user.update({
//             where: { id: user.id },
//             data: { safeWallet_confirmation: true }
//           });
//           this.logger.log(`safeWallet_confirmation flag updated to true for user ${user.email}.`);
//         } else {
//           this.logger.log(`Safe wallet already exists for user ${user.email}.`);
//         }
//       });
//       return safeWalletAddress;
//     } catch (error) {
//       this.logger.error(`Error deploying safe wallet for user ${user.email}:`, error);
//       throw error;
//     }
//   }
// }
