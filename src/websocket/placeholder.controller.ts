import { applyDecorators, Controller, Get, Injectable, Type } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { EventDtoMapping, WsEventDto, WsEventNames } from "../websocket/dto/notification.dto";

function generateApiResponses(mapping: typeof EventDtoMapping): MethodDecorator {
  const decorators = Object.keys(mapping).map((key, index) => {
    const eventName = key as WsEventNames;
    return ApiResponse({
      status: 200 + index,
      description: generateDescription(eventName, key),
      type: mapping[eventName] as Type
    });
  });

  return applyDecorators(...decorators);
}

function generateDescription(eventName: WsEventNames, key: string): string {
  // You can customize this function to return a description based on the event name
  const descriptions: Record<WsEventNames, string> = {
    walletCreated: "Wallet Created",
    walletCreationFailed: "Wallet Creation Failed",
    channelOpened: "Channel Info",
    channelOpeningFailed: "Channel Opening Failed",
    channelClosed: "Channel Closed",
    transactionFailed: "Transaction Failed",
    transactionReceipt: "User Confirmed Transaction",
    payoutCompleted: "Payout Completed",
    cheddrTransferCompleted: "Cheddr Transfer Completed",
    caChing: "CaChing Notification",
    auth_error: "When the initial registration of the auth token fails with the system",
    // outgoingChannelUpdate: "Channel Updates for Sender, when a users outgoing payment channel status changed",
    // incomingChannelUpdate: "Channel Updates for Receiver",
    orderScanned: "When a user scans an order",
    orderCompleted: "Order Completed",
    orderCancelled: "Order Cancelled",
    // balanceUpdated: "When a balance of a user changes",
    emailWasConfirmed: "Email Was Confirmed",
    nftRevealFinished: "NFT Reveal is done. not fired yet",
    sessionReset:
      "The user changed their password. all sessions except the one preforming the change have been invalidated. logg in again."
  };

  return key + " : " + descriptions[eventName] || "Response";
}

@Injectable()
@Controller("dummy-for-ws")
export class PlaceholderController {
  /* This class exists to put all ApiExtraModels on top, so that they end up in the final OpenAPI document */

  /* Maybe let's merge it with IncomingMessagesSocket */
  @Get("/")
  @generateApiResponses(EventDtoMapping)
  @ApiResponse({ status: 299, description: "Event retrieved successfully", type: WsEventDto })
  placeHolderMethod() {
    // This is just a placeholder method to attach the DTOs to the Swagger documentation.
    return null;
  }
}
