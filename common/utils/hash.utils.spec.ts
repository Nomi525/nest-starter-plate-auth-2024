import * as bcrypt from "bcryptjs";
import { verifyHash } from "@common/utils/hash-password";

describe("verifyHash", () => {
  let password: string;
  let hashedPassword: string;

  beforeAll(async () => {
    password = "TestPassword123!";
    hashedPassword = await bcrypt.hash(password, 12);
    console.log("hashedPassword", hashedPassword);
  });

  it("should return true for a valid password", async () => {
    const result = await verifyHash(password, hashedPassword);
    expect(result).toBe(true);
  });

  it("should return false for an invalid password", async () => {
    const result = await verifyHash("WrongPassword", hashedPassword);
    expect(result).toBe(false);
  });

  it("should return false for an empty password", async () => {
    const result = await verifyHash("", hashedPassword);
    expect(result).toBe(false);
  });

  it("should return false for an empty hash", async () => {
    const result = await verifyHash(password, "");
    expect(result).toBe(false);
  });

  it("should return false for an empty password and hash", async () => {
    const result = await verifyHash("", "");
    expect(result).toBe(false);
  });
});
