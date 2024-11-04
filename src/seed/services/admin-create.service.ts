// // services/admin-user.service.ts
// import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PrismaService } from "@modules/repositories/prisma.service";
// import { SeedUtils } from "@modules/seed/utils/seed-utils";
// import { UserRole } from "@prisma/client";
// import { createPasswordHashes, encryptSeedPhrase } from "@modules/seed/utils/password-utils";
// import { createRandomUIWallet } from "@common/utils/crypto-utils";

// @Injectable()
// export class AdminUserService implements OnModuleInit {
//   private readonly logger = new Logger(AdminUserService.name);

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly prismaService: PrismaService,
//     private readonly seedUtils: SeedUtils
//   ) {}

//   async onModuleInit() {
//     const adminPassword = this.configService.get<string>("RUNONCE_ADMIN_PW");

//     if (adminPassword) {
//       await this.createAdminUser(adminPassword);
//     } else {
//       this.logger.log("RUNONCE_ADMIN_PW is not set. Skipping admin user creation.");
//     }
//   }

//   private async createAdminUser(adminPassword: string) {
//     const email = "admin@cheddr.net";

//     try {
//       const existingUser = await this.prismaService.user.findUnique({ where: { email } });

//       if (existingUser) {
//         this.logger.log(`Admin user with email ${email} already exists. Skipping creation.`);
//         return;
//       }

//       // Use the utility function to generate password hashes
//       const { authHash, lowEntropyHash } = await createPasswordHashes(email, adminPassword);
//       const adminUser = await this.seedUtils.createOrUpdateUser(email, authHash, UserRole.Admin);
//       const CreateWallet = await createRandomUIWallet();
//       const seedphrase = CreateWallet.seedPhrase!;
//       const serverSalt = encryptSeedPhrase(seedphrase, lowEntropyHash);
//       await this.seedUtils.deploySafeWalletForUser(adminUser, CreateWallet.address, serverSalt);

//       this.logger.log(`Admin user ${adminUser.email} created successfully.`);
//     } catch (error) {
//       this.logger.error("Error occurred during admin user creation:", error);
//     }
//   }
// }
