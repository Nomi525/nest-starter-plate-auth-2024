// crypto-utils.ts
/*this file collects utils that are originally meant for the frontend, but we replicate them here to utilize them in seed scripts and tests.*/
import * as CryptoJS from "crypto-js";
import * as bcrypt from "bcryptjs";
import { ethers } from "ethers";

/*would be nice to share this code between frontend and backend*/
export function generateSHA256Hash(input: string): string {
  return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

export function canonicalizeEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) {
    throw new Error("Invalid email address");
  }
  const cleanedLocalPart = localPart
    .split("+")[0] // Ignore everything after a plus sign
    .replace(/\./g, ""); // Remove dots
  return `${cleanedLocalPart}@${domain}`.toLowerCase();
}

export async function cheddrHash(email: string, password: string, bcryptRounds: number = 10): Promise<string> {
  if (bcryptRounds < 4 || bcryptRounds > 31) {
    throw new Error("Cost factor must be between 4 and 31");
  }

  const canonicalEmail = canonicalizeEmail(email);
  const emailHash = generateSHA256Hash(canonicalEmail).substring(0, 22); // Get the first 22 characters of the hash

  // bcrypt salt format: $2a$<bcryptRounds>$ + 22 characters
  const salt = `$2a$${bcryptRounds.toString().padStart(2, "0")}$${emailHash.replace(/\+/g, ".")}`;
  const combinedPassword = password + canonicalEmail;
  return await bcrypt.hash(combinedPassword, salt);
}

export async function createRandomUIWallet() {
  const ownerWallet2 = await ethers.Wallet.createRandom();
  return {
    address: ownerWallet2.address,
    privateKey: ownerWallet2.privateKey,
    seedPhrase: ownerWallet2.mnemonic?.phrase
  };
}

export function encryptWithAES(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function decryptWithAES(data: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(data, key);
  return CryptoJS.enc.Utf8.stringify(bytes);
}
