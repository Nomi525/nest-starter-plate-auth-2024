// import { Injectable, Logger } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PrismaService } from "@modules/repositories/prisma.service";
// import { SafeWalletDeployService } from "@modules/blockchain/safe-wallet-deploy.service";
// import { UserRole } from "@prisma/client";
// import { createRandomUIWallet } from "@common/utils/crypto-utils";
// import { ethers } from "ethers";
// import { Cheddr__factory } from "@contracts/bindings";
// import { CHEDDR_DECIMAL_PLACES } from "@common/constants";
// import { SeedUtils } from "@modules/seed/utils/seed-utils";
// import { createPasswordHashes, encryptSeedPhrase } from "@modules/seed/utils/password-utils";

// @Injectable()
// export class EnsureEmployeeService {
//   private readonly logger = new Logger(EnsureEmployeeService.name);

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly prismaService: PrismaService,
//     private readonly safeWalletDeployService: SafeWalletDeployService,
//     private readonly seedUtils: SeedUtils
//   ) {}

//   async execute() {
//     try {
//       const email = "test@capacity.at";
//       const password = "Admin@123";

//       // Generate password hashes
//       const { authHash, lowEntropyHash } = await createPasswordHashes(email, password);

//       // Create a random EOA wallet
//       const CreateWallet = await createRandomUIWallet();
//       const seedphrase = CreateWallet.seedPhrase!;

//       // Encrypt the seed phrase
//       const serverSalt = encryptSeedPhrase(seedphrase, lowEntropyHash);

//       // Create or update the user
//       const user = await this.seedUtils.createOrUpdateUser(email, authHash, UserRole.User);

//       // Deploy the Safe Wallet for the user
//       const safeWalletAddress = await this.seedUtils.deploySafeWalletForUser(user, CreateWallet.address, serverSalt);

//       // Create or update the employee record
//       let employee = await this.prismaService.cpcEmployee.findUnique({
//         where: { user_id: user.id }
//       });

//       if (!employee) {
//         employee = await this.prismaService.cpcEmployee.create({
//           data: {
//             user_id: user.id,
//             empoyment_active: true,
//             employment_start_date: new Date(),
//             created_at: new Date()
//           }
//         });
//         this.logger.log("Employee created.");
//       } else {
//         this.logger.log("Employee already exists.");
//       }

//       this.logger.log("Employee ensured successfully.");

//       // Transfer Cheddr tokens to the employee's safe wallet
//       const hotWalletPrivateKey = this.configService.getOrThrow<string>("WALLET_PRIVATE_KEY");
//       const cheddrTokenAddress = this.configService.getOrThrow<string>("CHEDDR_ADDRESS");
//       const rpcUrl = this.configService.getOrThrow<string>("RPC_URL");
//       const provider = new ethers.JsonRpcProvider(rpcUrl);
//       const hotWallet = new ethers.Wallet(hotWalletPrivateKey, provider);

//       const cheddrToken = Cheddr__factory.connect(cheddrTokenAddress, hotWallet);

//       if (!safeWalletAddress) {
//         throw new Error("Employee Safe wallet address not found.");
//       }
//       const transferTx = await cheddrToken.transfer(safeWalletAddress, ethers.parseUnits("100", CHEDDR_DECIMAL_PLACES));
//       await transferTx.wait();
//       this.logger.log(`Transferred 100 Cheddr tokens to ${safeWalletAddress}`);
//     } catch (error) {
//       this.logger.error("Error occurred during employee seeding:", error);
//       throw error;
//     }
//   }
// }
