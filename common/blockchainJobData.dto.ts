import { ImageProperties } from "../src/file/uploaded-file";
import { RegisterPayloadDto } from "../src/repositories/dtos/auth";
// import { PayInChannelDto } from "../sequencer/dto/channel.dto";
import { User } from "@prisma/client";

export type DefaultOnChainTransaction = {
  userId?: string,
  curdsAmount?: string,
  note: string
};

export type UserTriggeredOnChainTransaction = DefaultOnChainTransaction & {
  userId: string
};

// export type PayInChanneJobData = PayInChannelDto & {
//   userId: string;
// };

export type SafeTriggeredJobData = {
  safeWalletAddress: string,
  encodedTransaction: string
} & UserTriggeredOnChainTransaction;

export type SafeWalletCreationJobData = {
  user: User,
  payload: RegisterPayloadDto
} & UserTriggeredOnChainTransaction;

/*not a blockchain tx, belongs elsewhere*/
export type ProcessWeeklyPayoutJobData = {
  payoutId: string
};

export type ProcessUserPayoutJobData = {
  payoutId: string,
  weeklyUserPayoutId: string,
  curdsAmount: string,
  userSafeWalletAddress: string
} & UserTriggeredOnChainTransaction;

export type OpenChannelJobData = {
  predictedChannelId: string,
  curdsAmount: string
} & SafeTriggeredJobData;

export type CloseChannelJobData = {
  channelId: string,
  sequenceNumber: number,
  signatureTimestamp: number,
  recipients: string[],
  amounts: string[],
  userSignature: string
} & UserTriggeredOnChainTransaction;

export type SendCheddrJobData = {
  receiverAddress: string,
  curdsAmount: string
} & SafeTriggeredJobData;

export type OnrampTransactionJobData = {
  userWalletAddress: string,
  curdsAmount: string
} & UserTriggeredOnChainTransaction;

export type NftRevealJobData = {
  tokenId: number,
  tokenUri: string
} & DefaultOnChainTransaction;

export type ImageValidateJobData = {
  filePath: string,
  fileId: string,
  imageId: string
};
export type ImageVariantJobData = {
  properties: ImageProperties
} & ImageValidateJobData;
