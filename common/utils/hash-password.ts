import * as bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const randomSalt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, randomSalt);
};

export const verifyHash = async (userInput: string, password_hash: string): Promise<boolean> => {
  return bcrypt.compare(userInput, password_hash);
};
