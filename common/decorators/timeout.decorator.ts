import { SetMetadata } from "@nestjs/common";

export const Timeout = (ms: number) => SetMetadata("timeout", ms);
