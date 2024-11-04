// import { cheddrHash, encryptWithAES, generateSHA256Hash } from "@common/utils/crypto-utils";

// export async function createPasswordHashes(email: string, password: string) {
//   const rootPwHash = await cheddrHash(email, password);
//   const authHash = generateSHA256Hash("auth" + rootPwHash);
//   const lowEntropyHash = generateSHA256Hash("leh" + rootPwHash);

//   return { authHash, lowEntropyHash };
// }

// export function encryptSeedPhrase(seedPhrase: string, lowEntropyHash: string) {
//   return encryptWithAES(seedPhrase, lowEntropyHash);
// }
