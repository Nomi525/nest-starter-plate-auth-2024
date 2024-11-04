import  RequiredBooleanProperty from "../../common/utils/annotations/dto/required-boolean.property";
import backendVersion from "../../backend-version";
import RequiredStringProperty from "../../common/utils/annotations/dto/required-string.property";
export class ClientConfig {
  @RequiredBooleanProperty("user prefers dark (just an example)")
  isDarkSchema: boolean;

  @RequiredStringProperty("version the backend is running on, determined by the build process")
  backendVersion: string = backendVersion;

  @RequiredStringProperty("Chain ID of the blockchain network")
  chainId: string;

  @RequiredStringProperty("NFT Token Address")
  nftTokenAddress: string;

  @RequiredStringProperty("ERC20 Token Address (CHEDDR)")
  erc20TokenAddress: string;

  @RequiredStringProperty("Channel Manager Contract Address")
  channelManagerAddress: string;

  // @RequiredStringProperty("CHEDDR price in curds per USD")
  // cheddrPrice_curdsPerUsd: string;

  @RequiredStringProperty("ipfs gateway")
  ipfsGatewayUrl: string;

  @RequiredBooleanProperty("this environment allows logins")
  allowLogin: boolean;
}
