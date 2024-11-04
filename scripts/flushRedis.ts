import Redis from "ioredis";
import * as dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD
});

async function flushRedis() {
  try {
    await redis.flushall();
    console.log("Successfully flushed all Redis databases.");
  } catch (error) {
    console.error("Error flushing Redis databases:", error);
  } finally {
    redis.disconnect();
  }
}

flushRedis();
