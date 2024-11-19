// import * as bcrypt from "bcryptjs";

// export const hashPassword = async (password: string): Promise<string> => {
//   const randomSalt = await bcrypt.genSalt(12);
//   return bcrypt.hash(password, randomSalt);
// };

// export const verifyHash = async (userInput: string, password_hash: string): Promise<boolean> => {
//   return bcrypt.compare(userInput, password_hash);
// };

import { HttpException, HttpStatus } from "@nestjs/common";
import * as argon2 from "argon2";
import { log } from "util";

// Strong TypeScript types for password hashing and validation
// type PasswordService = {
//   hashPassword: (plainPassword: string) => Promise<string>;
//   verifyHash: (plainPassword: string, storedHash: string) => Promise<boolean>;
// };

// Function to hash a plain password
const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    return await argon2.hash(plainPassword, {
      type: argon2.argon2id, // Argon2id is secure and resistant to side-channel attacks
      memoryCost: 2 ** 16, // High memory cost for added security
      timeCost: 3, // Number of iterations
      parallelism: 1 // Single-threaded for simplicity
    });
  } catch (error: unknown) {
    throw new Error(`Error hashing password: ${(error as Error).message}`);
  }
};

// Function to validate a password against the stored hash
const verifyHash = async (plainPassword: string, storedHash: string): Promise<boolean> => {
  try {
    console.log("Generated hash:", plainPassword, storedHash);

    const result: boolean = await argon2.verify(storedHash, plainPassword);
    if (!result) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
    return result;
  } catch (error: unknown) {
    console.log({ error });

    throw new Error(`Error validating password: ${(error as Error).message}`);
  }
};

// Export functions for external usage
export { hashPassword, verifyHash };

// Example usage
(async () => {
  const plainPassword = "Admin@123";
  const hashedPassword = await hashPassword(plainPassword);

  console.log("Hashed Password:", hashedPassword);

  // const isValid = await verifyHash(hashedPassword, plainPassword);
  const isValid = await verifyHash(plainPassword, hashedPassword);
  console.log("Is password valid:", isValid);
})();
