// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "@modules/repositories/prisma.service";
// import { SafeWalletDeployService } from "@modules/blockchain/safe-wallet-deploy.service";
// import { ethers } from "ethers";

// @Injectable()
// export class RedeployMissingSafeService {
//   private readonly logger = new Logger(RedeployMissingSafeService.name);

//   constructor(
//     private readonly prismaService: PrismaService,
//     private readonly safeWalletDeployService: SafeWalletDeployService
//   ) {}

//   async execute(): Promise<void> {
//     this.logger.log("Starting the redeploy missing safe wallet process...");

//     const safeWallets = await this.prismaService.safeWallet.findMany();

//     for (const safeWallet of safeWallets) {
//       const { safeWalletAddress, user_EOA_address } = safeWallet;

//       try {
//         const isContractDeployed = await this.isContractDeployed(safeWalletAddress);

//         if (!isContractDeployed) {
//           this.logger.warn(`Safe wallet at address ${safeWalletAddress} is not deployed. Attempting to redeploy...`);

//           const predictedAddress = await this.safeWalletDeployService.predictSafeWalletAddress(user_EOA_address);

//           if (predictedAddress !== safeWalletAddress) {
//             this.logger.error(
//               `Predicted address ${predictedAddress} does not match stored address ${safeWalletAddress}.`
//             );
//             continue;
//           }

//           await this.safeWalletDeployService.deployWallet(user_EOA_address);

//           this.logger.log(`Redeployed Safe wallet for user with EOA address ${user_EOA_address}.`);
//         } else {
//           this.logger.log(`Safe wallet at address ${safeWalletAddress} is already deployed.`);
//         }
//       } catch (error) {
//         this.logger.error(`Error checking/redeploying Safe wallet for address ${safeWalletAddress}:`, error);
//       }
//     }

//     this.logger.log("Finished redeploy missing safe wallet process.");
//   }

//   private async isContractDeployed(address: string): Promise<boolean> {
//     const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
//     const code = await provider.getCode(address);
//     return code !== "0x";
//   }
// }
