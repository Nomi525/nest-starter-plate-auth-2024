// import { Injectable, Logger } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PrismaService } from "@modules/repositories/prisma.service";
// import { OpenChannelService } from "@modules/sequencer/openchannel.service";
// import { ethers, HDNodeWallet } from "ethers";
// import { Cheddr__factory, CheddrChannelManager__factory } from "@contracts/bindings";
// import { cheddrHash, decryptWithAES, generateSHA256Hash } from "@common/utils/crypto-utils";
// import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
// import { SigningMethod } from "@safe-global/protocol-kit";
// import { blockchainTimestamp } from "@common/utils/blockchain-timestamp";
// import { SafeFactoryConfigProvider } from "@modules/blockchain/safe-factory-config.provider";
// import { Queue } from "bull";
// import { HOTWALLET_QUEUE_NAME } from "@common/queues.constants";
// import { ChannelUtilsService } from "@modules/sequencer/channel-utils.service";
// import { CHEDDR_DECIMAL_PLACES } from "@common/constants";
// import { InjectQueue } from "@nestjs/bull";
// import { SafeWalletCreationJobData } from "@common/blockchainJobData.dto";

// @Injectable()
// export class SeedOpenChannelService {
//   private readonly logger = new Logger(SeedOpenChannelService.name);

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly prismaService: PrismaService,
//     private readonly openChannelService: OpenChannelService,
//     private readonly safeFactoryConfigProvider: SafeFactoryConfigProvider,
//     private readonly channelUtilsService: ChannelUtilsService,
//     @InjectQueue(HOTWALLET_QUEUE_NAME) private queue: Queue<SafeWalletCreationJobData>
//   ) {}

//   async execute(): Promise<void> {
//     let jobProcessed = false;

//     const handleJobCompletion = (jobId: number | string) => {
//       jobProcessed = true;
//       this.logger.log(`Job ${jobId} completed successfully.`);
//     };

//     const handleJobFailure = (jobId: number | string, error: Error) => {
//       jobProcessed = true;
//       this.logger.error(`Job ${jobId} failed:`, error);
//     };

//     try {
//       this.queue.on("completed", job => handleJobCompletion(job.id));
//       this.queue.on("failed", (job, error) => handleJobFailure(job.id, error));

//       this.logger.log("Starting the open channel seeding process...");

//       // Fetch the employee user
//       const email = "test@capacity.at";
//       this.logger.log(`Fetching user with email: ${email}`);
//       const user = await this.prismaService.user.findUnique({
//         where: { email },
//         include: { SafeWallet: true }
//       });

//       if (!user || !user.SafeWallet) {
//         throw new Error(`User or their wallet not found for email ${email}.`);
//       }

//       this.logger.log("User found. Decrypting the wallet...");

//       const rootPwHash = await cheddrHash(email, "Admin@123");
//       const lowEntropyHash = generateSHA256Hash("leh" + rootPwHash);

//       const safeWalletAddress = user.SafeWallet.safeWalletAddress;
//       const userEOAAddress = user.SafeWallet.user_EOA_address;
//       const serverSalt = user.SafeWallet.server_salt;

//       // Decrypt the wallet
//       const seedPhrase = decryptWithAES(serverSalt, lowEntropyHash);
//       const wallet = HDNodeWallet.fromPhrase(seedPhrase);

//       if (wallet.address !== userEOAAddress) {
//         throw new Error("Decrypted wallet address does not match the stored user EOA address.");
//       }

//       this.logger.log(`Wallet decrypted successfully. User EOA address: ${userEOAAddress}`);

//       const hotWalletPrivateKey = this.configService.getOrThrow<string>("WALLET_PRIVATE_KEY");
//       const cheddrTokenAddress = this.configService.getOrThrow<string>("CHEDDR_ADDRESS");
//       const cheddarChannelManagerAddress = this.configService.getOrThrow<string>("CHEDDRCHANNELMANAGER_ADDRESS");
//       const rpcUrl = this.configService.getOrThrow<string>("RPC_URL");
//       const provider = new ethers.JsonRpcProvider(rpcUrl);
//       const hotWallet = new ethers.Wallet(hotWalletPrivateKey, provider);
//       const cheddrToken = Cheddr__factory.connect(cheddrTokenAddress, hotWallet);
//       const cheddrChannelManager = CheddrChannelManager__factory.connect(cheddarChannelManagerAddress, hotWallet);
//       const eoaPrivkey = wallet.privateKey;
//       const safe = await this.safeFactoryConfigProvider.getSafeInstanceToSign(safeWalletAddress, eoaPrivkey);

//       // Step 1: Create the allowance transaction using the Safe instance
//       const allowanceAmount = ethers.parseUnits("10", CHEDDR_DECIMAL_PLACES);
//       this.logger.log("Creating allowance transaction...");
//       const allowanceTx = await cheddrToken.approve.populateTransaction(cheddarChannelManagerAddress, allowanceAmount);

//       // Step 2: Create the open channel transaction using the Safe instance
//       const expiryTime = blockchainTimestamp() + 60 * 60 * 24 * 30; // 1 month
//       this.logger.log("Creating open channel transaction...");
//       const openChannelTx = await cheddrChannelManager.openChannel.populateTransaction(allowanceAmount, expiryTime);

//       // Step 3: Create and sign the Safe transactions
//       const allowanceMetaTx: MetaTransactionData = {
//         to: cheddrTokenAddress,
//         value: "0",
//         data: allowanceTx.data
//       };
//       const openChannelMetaTx: MetaTransactionData = {
//         to: cheddarChannelManagerAddress,
//         value: "0",
//         data: openChannelTx.data
//       };
//       const transactions: MetaTransactionData[] = [allowanceMetaTx, openChannelMetaTx];

//       const nonceFromContract = await safe.getNonce();

//       this.logger.log("Creating Safe transaction...");
//       const unsigedTx = await safe.createTransaction({
//         transactions: transactions,
//         options: { nonce: nonceFromContract }
//       });
//       // Sign the transaction with the EOA account
//       const signedSafeTransaction = await safe.signTransaction(unsigedTx);

//       const encodedTransaction = await safe.getEncodedTransaction(signedSafeTransaction);

//       const channelId = await this.channelUtilsService.getChannelId(safeWalletAddress, expiryTime, allowanceAmount);
//       const timestamp = blockchainTimestamp();
//       const initialMessage = await this.channelUtilsService.messageToSignForChannelUpdate({
//         channelId,
//         sequenceNumber: 0,
//         timestamp,
//         amounts: [],
//         recipients: []
//       });
//       const message = safe.createMessage(initialMessage);
//       const ethSafeMessage = await safe.signMessage(message, SigningMethod.ETH_SIGN_TYPED_DATA_V4, safeWalletAddress);
//       const userSignature = ethSafeMessage.encodedSignatures();

//       this.logger.log("Submitting open channel request to service...");
//       await this.openChannelService.openChannel(
//         {
//           amount: allowanceAmount.toString(),
//           expiryTime,
//           openChannelTx: {
//             encodedTransaction: encodedTransaction,
//             userSignature: userSignature,
//             signatureTimestamp: timestamp
//           }
//         },
//         user.id
//       );

//       this.logger.log("Waiting for the job to be processed...");
//       // Wait for the job to be processed
//       while (!jobProcessed) {
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
//     } catch (error) {
//       this.logger.error("Error occurred during channel opening test:", error);
//     }
//   }
// }
