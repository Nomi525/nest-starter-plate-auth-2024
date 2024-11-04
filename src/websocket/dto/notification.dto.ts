import RequiredStringProperty from "../../../common/utils/annotations/dto/required-string.property";
import EthereumAddress from "../../../common/utils/annotations/dto/ethereum-address.property";
import RequiredArrayProperty from "../../../common/utils/annotations/dto/required-array.property";
import UuidProperty from "../../../common/utils/annotations/dto/uuid.property";
import EnumProperty from "../../../common/utils/annotations/dto/enum.property";
import RequiredNumberProperty from "../../../common/utils/annotations/dto/required-number.property";

export class BaseDto {
  @RequiredStringProperty("Human Readable Message")
  message: string;
}

export class BasicTransactionInfoDto extends BaseDto {
  @RequiredStringProperty("Transaction ID")
  transactionId: string;
}

export class PasswordChangedEvent extends BaseDto {
  @RequiredStringProperty(
    "AuthId ID that is _not_ logged out. All other session should consider themselves logged out."
  )
  remainingAuthId: string;
}

export class NftRevealFinishedDto extends BasicTransactionInfoDto {
  @RequiredNumberProperty("token ID that was revealed")
  tokenId: number;
  @RequiredStringProperty("Transaction ID")
  tokenUri: string;
}

export class CaChingItem extends BasicTransactionInfoDto {
  @RequiredStringProperty("amount")
  onchainAmount: string;
}

export class CaChaingDto extends BaseDto {
  @RequiredArrayProperty(CaChingItem, "list of notifications")
  notifications: CaChingItem[];
}

export class UserConfirmedTransactionDto extends BasicTransactionInfoDto {
  @RequiredStringProperty("User ID")
  userId: string;
}

export class CheddrTransferCompletedDto extends BasicTransactionInfoDto {
  @RequiredStringProperty("amount")
  amount: string;

  @EthereumAddress("receiver")
  receiver: string;
}

export class ChannelWSInfoDto extends BasicTransactionInfoDto {
  @RequiredStringProperty("Channel Id")
  channelId: string;
  @RequiredStringProperty("balance in curds")
  balance: string;

  // @RequiredProperty("info about the onchain Balance after an onchain Transaction")
  // onChainBalance: WalletBalanceDto;
}

export class WalletCreationInProgressDto extends BaseDto {
  @RequiredStringProperty("Wallet creation in progress message")
  message: string;
}

export class WalletCreatedDto extends BaseDto {
  @RequiredStringProperty("Wallet creation success message")
  message: string;

  @EthereumAddress("Address of the newly created wallet")
  walletAddress: string;
}

export class WalletCreationFailedDto extends BaseDto {
  @RequiredStringProperty("Wallet creation failure message")
  message: string;
}

// export class ChannelStatusUpdateDto extends ChannelStatusDto {
//   @RequiredStringProperty("Wallet creation failure message")
//   message: string;
// }

export class OrderCustomerInfo extends BaseDto {
  @UuidProperty("Wallet creation failure message")
  orderId: string;

  @UuidProperty("Who scanned")
  userId: string;

  @RequiredStringProperty("who scanned")
  userDisplayName: string;
}

// Define a type that maps event names to their respective DTO classes
export const EventDtoMapping = {
  walletCreated: WalletCreatedDto,
  walletCreationFailed: WalletCreationFailedDto,
  emailWasConfirmed: BaseDto,
  channelOpened: ChannelWSInfoDto,
  channelOpeningFailed: ChannelWSInfoDto,
  channelClosed: ChannelWSInfoDto,
  transactionFailed: BasicTransactionInfoDto,
  transactionReceipt: UserConfirmedTransactionDto,
  payoutCompleted: UserConfirmedTransactionDto,
  cheddrTransferCompleted: CheddrTransferCompletedDto,
  caChing: CaChaingDto,
  auth_error: BaseDto,
  // outgoingChannelUpdate: ChannelStatusUpdateDto,
  // incomingChannelUpdate: ChannelStatusUpdateDto,
  orderScanned: OrderCustomerInfo,
  orderCompleted: OrderCustomerInfo,
  orderCancelled: OrderCustomerInfo,
  // balanceUpdated: WalletBalanceDto,
  nftRevealFinished: NftRevealFinishedDto,
  sessionReset: PasswordChangedEvent
} as const;

export type WsEventNames = keyof typeof EventDtoMapping;

export type EventDtoMapping = {
  [K in keyof typeof EventDtoMapping]: InstanceType<(typeof EventDtoMapping)[K]>;
};

export const WsEventEnum = Object.freeze(
  Object.keys(EventDtoMapping).reduce(
    (acc, key) => {
      acc[key as WsEventNames] = key;
      return acc;
    },
    {} as Record<WsEventNames, string>
  )
);

export class WsEventDto {
  @EnumProperty(WsEventEnum, "All of the WebSocket event names")
  eventName: string;
}
