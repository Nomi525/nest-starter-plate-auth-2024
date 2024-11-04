import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis, { RedisKey } from "ioredis";
import { promisify } from "util";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  private subscriberClient: Redis;
  private publisherClient: Redis;
  private subscribedChannels: string[] = [];

  constructor(private readonly configService: ConfigService) {
    const redisConfig = {
      host: this.configService.get<string>("REDIS_HOST"),
      port: Number(this.configService.get<string>("REDIS_PORT")),
      // port: parseInt(configService.get("REDIS_PORT")!, 10),
      // username: this.configService.get("REDIS_USERNAME"),
      // password: this.configService.get("REDIS_PASSWORD")
    };

    this.subscriberClient = new Redis(redisConfig);
    this.publisherClient = new Redis(redisConfig);
  }

  onModuleInit(): void {
    this.publisherClient.on("connect", () => {
      this.logger.log("Redis publisher client connected");
    });

    this.subscriberClient.on("connect", () => {
      this.logger.log("Redis subscriber client connected");
    });
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.publisherClient.publish(channel, message);
  }

  subscribe(channel: string, handler: (channel: string, message: string) => void): void {
    this.subscriberClient.on("message", handler);
    this.subscriberClient.subscribe(channel);
    this.subscribedChannels.push(channel);
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriberClient.unsubscribe(channel);
    this.subscribedChannels = this.subscribedChannels.filter(ch => ch !== channel);
  }

  onModuleDestroy(): void {
    this.publisherClient.disconnect();
    this.subscriberClient.disconnect();
  }

  async set(key: RedisKey, value: string | Buffer | number): Promise<void> {
    const setAsync = promisify(this.publisherClient.set).bind(this.publisherClient);
    await setAsync(key, value);
  }

  async del(key: string): Promise<void> {
    await this.publisherClient.del(key);
  }

  async get(key: string): Promise<string | null> {
    return await this.publisherClient.get(key);
  }

  async incr(key: string): Promise<number> {
    return await this.publisherClient.incr(key);
  }

  async decr(key: string): Promise<number> {
    return await this.publisherClient.decr(key);
  }
}
