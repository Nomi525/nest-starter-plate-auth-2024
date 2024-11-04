import { ethers } from "ethers";
import { CHEDDR_DECIMAL_PLACES } from "../../common/constants";
import { Decimal } from "@prisma/client/runtime/library";

export function formatCheddr(cheddrBalance: bigint | Decimal | string) {
  if (cheddrBalance instanceof Decimal) {
    return ethers.formatUnits(cheddrBalance.toFixed(), CHEDDR_DECIMAL_PLACES);
  }
  return ethers.formatUnits(cheddrBalance, CHEDDR_DECIMAL_PLACES);
}
