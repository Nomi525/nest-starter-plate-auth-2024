import { Decimal } from "@prisma/client/runtime/library";

export function toDecimal(amountBigInt: bigint): Decimal {
  return new Decimal(amountBigInt.toString());
}
