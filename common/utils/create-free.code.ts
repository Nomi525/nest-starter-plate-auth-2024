import { randomBytes } from "ethers";
import { base32 } from "rfc4648";

export const createFreeCode = async (candidateCheck?: (code: string) => Promise<boolean>) => {
  let firstSix: string = "";
  let codeIsFree = false;
  const maxRetries = 5;
  let attempts = 0;
  while (!codeIsFree) {
    const hash = randomBytes(32);
    const encodedHash = base32.stringify(hash);
    firstSix = encodedHash.substring(0, 6);
    codeIsFree = candidateCheck ? await candidateCheck(firstSix) : true;
    attempts++;
    if (attempts > maxRetries) {
      throw new Error("something is wrong, unable to create code..");
    }
  }
  return firstSix;
};
