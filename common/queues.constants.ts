// common/queues.constants.ts
import {
  CloseChannelJobData,
  ImageValidateJobData,
  ImageVariantJobData,
  NftRevealJobData,
  OnrampTransactionJobData,
  OpenChannelJobData,
  ProcessUserPayoutJobData,
  ProcessWeeklyPayoutJobData,
  SafeWalletCreationJobData,
  SendCheddrJobData
} from "../common/blockchainJobData.dto";

export const HOTWALLET_QUEUE_NAME = "hotwallet-queue";
export const IMAGE_PROCESS_QUEUE = "imageProcess-queue";
export const WEEKLY_SCHEDULE_PAYOUTS = "weeklyPayoutScheduler";
export const SCHEDULED_CHANNEL_CLOSURE_QUEUE = "channel-closure";
export const SEQUENCER_BROADCAST_QUEUE = "sequencer-broadcaster";
export const SEQUENCER_UPDATES_QUEUE = "sequencer-updates";
export const REVEAL_NFT_QUEUE = "reveal-nft";

export enum BullJobNames {
  // PAY_IN_CHANNEL = "payInChannel",
  PROCESS_WEEKLY_PAYOUT = "process-weekly-payout",
  PROCESS_USER_PAYOUT = "process-user-payout",
  SAFE_WALLET_CREATION = "safe-wallet-creation",
  OPEN_CHANNEL = "open-channel-job",
  CLOSE_CHANNEL = "close-channel-job",
  SEND_CHEDDR = "send-cheddr",
  ONRAMP_PAYOUT = "onramp-payout",
  REVEAL_NFT = "reveal-nft",
  VALIDATE_IMAGE = "validate-image",
  VARIANT_IMAGE = "variant-image"
}

type JobTypesMap = {
  // [BullJobNames.PAY_IN_CHANNEL]: PayInChanneJobData,
  [BullJobNames.PROCESS_WEEKLY_PAYOUT]: ProcessWeeklyPayoutJobData,
  [BullJobNames.PROCESS_USER_PAYOUT]: ProcessUserPayoutJobData,
  [BullJobNames.SAFE_WALLET_CREATION]: SafeWalletCreationJobData,
  [BullJobNames.OPEN_CHANNEL]: OpenChannelJobData,
  [BullJobNames.CLOSE_CHANNEL]: CloseChannelJobData,
  [BullJobNames.SEND_CHEDDR]: SendCheddrJobData,
  [BullJobNames.ONRAMP_PAYOUT]: OnrampTransactionJobData,
  [BullJobNames.REVEAL_NFT]: NftRevealJobData,
  [BullJobNames.VALIDATE_IMAGE]: ImageValidateJobData,
  [BullJobNames.VARIANT_IMAGE]: ImageVariantJobData
};

// This type ensures that every job name in the enum has a corresponding type in the JobTypesMap
type EnsureAllJobTypesAreMapped = {
  [K in keyof typeof BullJobNames]: JobTypesMap[(typeof BullJobNames)[K]]
};

// This type alias helps to ensure that every job name has exactly one associated type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type JobTypes = EnsureAllJobTypesAreMapped;
