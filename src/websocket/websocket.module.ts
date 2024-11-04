import { Module } from "@nestjs/common";
import { UserNotificationGateway } from "./user-notification-gateway.service";
import { PrismaService } from "../repositories/prisma.service";
import { RedisService } from "../redis/redis.service";
import { RedisModule } from "../redis/redis.module";
import { PlaceholderController } from "../websocket/placeholder.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [RedisModule, AuthModule],
  providers: [UserNotificationGateway, PrismaService, RedisService],
  controllers: [PlaceholderController],
  exports: [UserNotificationGateway]
})
export class WebsocketModule {}
