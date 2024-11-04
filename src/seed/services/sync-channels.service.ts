// import { Injectable, Logger } from "@nestjs/common";
// import { PrismaService } from "@modules/repositories/prisma.service";
// import { ethers } from "ethers";
// import { CheddrChannelManager__factory } from "@contracts/bindings";
// import { ConfigService } from "@nestjs/config";

// @Injectable()
// export class SyncChannelsService {
//   private readonly logger = new Logger(SyncChannelsService.name);

//   constructor(
//     private readonly prismaService: PrismaService,
//     private readonly configService: ConfigService
//   ) {}

//   async execute(): Promise<void> {
//     this.logger.log("Starting the sync of channels with the on-chain state...");

//     const cheddrChannelManagerAddress = this.configService.getOrThrow<string>("CHEDDRCHANNELMANAGER_ADDRESS");
//     const rpcUrl = this.configService.getOrThrow<string>("RPC_URL");
//     const provider = new ethers.JsonRpcProvider(rpcUrl);
//     const cheddrChannelManager = CheddrChannelManager__factory.connect(cheddrChannelManagerAddress, provider);

//     const safeWallets = await this.prismaService.safeWallet.findMany();

//     for (const safeWallet of safeWallets) {
//       const userChannelsOnChain: string[] = [];

//       // Get the number of channels associated with the wallet on-chain
//       const numChannels = await cheddrChannelManager.getUserChannelLength(safeWallet.safeWalletAddress);

//       for (let i = 0; i < numChannels; i++) {
//         const channelId = await cheddrChannelManager.userChannels(safeWallet.safeWalletAddress, i);
//         const { owner, balance, expiryTime } = await cheddrChannelManager.channels(channelId);
//         this.logger.log(`on chain channelId: ${channelId} ${owner} ${balance} ${expiryTime}`);
//         userChannelsOnChain.push(channelId);
//       }

//       const userChannelsInDB = await this.prismaService.channel.findMany({
//         where: { owner: safeWallet.safeWalletAddress }
//       });

//       // Delete channels in the DB that are not on-chain
//       for (const channel of userChannelsInDB) {
//         if (!userChannelsOnChain.includes(channel.channelId)) {
//           // First, delete any records that reference this channel in related tables
//           await this.prismaService.channelRecipient.deleteMany({
//             where: { channelId: channel.id }
//           });

//           // Now, delete the channel itself
//           await this.prismaService.channel.delete({
//             where: { id: channel.id }
//           });

//           this.logger.log(`Deleted channel ${channel.channelId} for wallet ${safeWallet.safeWalletAddress}`);
//         }
//       }

//       // Insert channels that are on-chain but not in the DB
//       for (const channelId of userChannelsOnChain) {
//         const existingChannel = await this.prismaService.channel.findUnique({ where: { channelId } });

//         if (!existingChannel) {
//           this.logger.warn(`missing channel in DB: ${channelId}`);
//           // we can not create those channels in the DB, since we are missing the initial user signatures. we could, however resuce the channels if we were to receive a new signed update with a higher sequence number
//           /*
//                     const _channelInfo = await cheddrChannelManager.channels(channelId);

//                     await this.prismaService.channel.create({
//                       data: {
//                         channelId,
//                         owner: channelInfo.owner,
//                         balance: channelInfo.balance.toString(),
//                         expiryTimestamp: Number(channelInfo.expiryTime),
//                         sequenceNumber: Number(channelInfo.sequenceNumber),
//                         status: "OPEN"
//                       }
//                     });
//           */
//           this.logger.log(`Inserted channel ${channelId} for wallet ${safeWallet.safeWalletAddress}`);
//         }
//       }
//     }

//     this.logger.log("Finished syncing channels with on-chain state.");
//   }
// }
