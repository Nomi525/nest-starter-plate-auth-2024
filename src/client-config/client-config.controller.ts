import { PrivateGetRequest } from "../../common/utils/annotations/controllers/private-get-request";
import { PublicGetRequest } from "../../common/utils/annotations/controllers/public-get-request";
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { Catch, Controller } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

import backendVersion from "../../backend-version";
import { getMyEnv } from "../../environment";
import { ClientConfig } from "./client.config.dto";

@ApiTags("client-config")
@Catch()
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse()
@Controller("client-config")
export class ClientConfigController {
  private readonly chainId: bigint;
  private readonly cheddrTokenAddress: string;
  private readonly cheddarNftAddress: string;
  private readonly channelManagerAddress: string;

  constructor(
    private readonly configService: ConfigService
    // private readonly cheddrPriceService: CheddrPriceService
  ) {
    this.chainId = BigInt(this.configService.get<string>("CHAIN_ID", "31337"));
    this.cheddrTokenAddress = this.configService.get<string>("CHEDDR_ADDRESS", "");
    this.cheddarNftAddress = this.configService.get<string>("CHEDDARNFT_ADDRESS", "");
    this.channelManagerAddress = this.configService.get<string>("CHEDDRCHANNELMANAGER_ADDRESS", "");
  }

  @PublicGetRequest("/defaultConfig", ClientConfig, "")
  async getPublicConfig(): Promise<ClientConfig> {
    return this.getDefaultConfig();
  }

  @PrivateGetRequest("/authConfig", ClientConfig, "", UserRole.Guest)
  async getAuthconfig(/*@AuthorizedUser() user: JwtPayloadDto*/): Promise<ClientConfig> {
    // Optionally, obtain user-specific config from the database if required.
    return this.getDefaultConfig();
  }

  private async getDefaultConfig(): Promise<ClientConfig> {
    return {
      backendVersion: backendVersion,
      isDarkSchema: false,
      chainId: this.chainId.toString(),
      nftTokenAddress: this.cheddarNftAddress,
      erc20TokenAddress: this.cheddrTokenAddress,
      channelManagerAddress: this.channelManagerAddress,
      // cheddrPrice_curdsPerUsd: (await this.cheddrPriceService.getCheddrPrice()).toString(),
      ipfsGatewayUrl: this.configService.get("IPFS_GATEWAY", "https://cloudflare-ipfs.com/ipfs"),
      allowLogin: getMyEnv().enableLogin
    };
  }
}
