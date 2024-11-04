import { NestModule, Type } from "@nestjs/common";
import { DevModule } from "./devModule";
import { StagingModule } from "./stagingModule";
import { ProdModule } from "./prodModule";

export function getMyEnv() {
  enum Environment {
    Development = "development",
    Test = "test",
    Production = "production"
  }

  const environmentConfig: Record<Environment, { module: Type<NestModule>; enableLogin: boolean }> = {
    [Environment.Development]: { module: DevModule, enableLogin: true },
    [Environment.Test]: { module: StagingModule, enableLogin: true },
    [Environment.Production]: { module: ProdModule, enableLogin: false }
  };

  const env = (process.env.NODE_ENV ?? Environment.Development) as Environment;

  // Ensure we are in a valid environment
  const validEnvironments = Object.values(Environment);
  if (!validEnvironments.includes(env)) {
    throw new Error(`Invalid NODE_ENV: ${env}. Must be one of ${validEnvironments.join(", ")}`);
  }

  return environmentConfig[env];
}
