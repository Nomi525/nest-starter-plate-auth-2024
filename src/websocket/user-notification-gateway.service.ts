import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { RedisService } from "../redis/redis.service";
import { formatError } from "../../common/utils/formatError";
import { BaseDto, EventDtoMapping, WsEventEnum } from "..//websocket/dto/notification.dto";
import { JwtManagmentService } from "..//auth/services/jwt-managment.service";

function userRoomName(userId: string) {
  return `USER_ROOM ${userId}`;
}

/*
export const WEBSOCKET_EVENT_NAME_CODE_CONFIRMED = "CodeConfirmed";
export const USER_EVENT_CODE_CONFIRMATION = WEBSOCKET_EVENT_NAME_CODE_CONFIRMED + "redisEvent";

export const WEBSOCKET_EVENT_NAME_TRANSACTION = "Transaction";
export const USER_EVENT_TRANSACTION = WEBSOCKET_EVENT_NAME_TRANSACTION + ":redisEvent";
*/

export type UserOnlineListener = {
  onUserCameOnline(userId: string, client: Socket<EventDtoMapping>): void;
};

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins for testing; adjust in production
  },
  path: "/push"
})
@Injectable()
/*ideally, this class should only handle WS logic and not business logic.
 it should take care that messages for users reach them reliably*/
export class UserNotificationGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  private readonly logger = new Logger(UserNotificationGateway.name);
  private listeners: UserOnlineListener[] = [];

  @WebSocketServer()
  private websocketService: Server | undefined; // this is injected from nest.js. if used outside a rest application it stays undefined.
  private activeConnections = 0;
  private jwtSecret: string;

  constructor(
    configService: ConfigService,
    private redisService: RedisService,
    private readonly jwtManagmentService: JwtManagmentService
  ) {
    this.jwtSecret = configService.get<string>("JWT_SECRET", "");
  }

  async onModuleInit() {
    this.logger.log("starting up WS Gateway");
  }

  async onModuleDestroy() {
    this.logger.log("shutting down WS Gateway");
  }

  async handleConnection(client: Socket) {
    this.activeConnections++;
    this.logger.log(`Socket connected! Active connections: ${this.activeConnections}`);
    this.logger.log(client.id);

    // Handle token validation during connection
    const token = client.handshake.auth.token;
    try {
      const decoded: JwtPayload = jwt.verify(token, this.jwtSecret) as JwtPayload;
      try {
        await this.jwtManagmentService.checkIfValidOrThrow(decoded);
      } catch (err) {
        client.emit(WsEventEnum.sessionReset);
        this.logger.error("User tried to connect using an outdated token");
        client.disconnect(true);
        return;
      }
      client.data.user = decoded;
      const userId = decoded.sub;
      if (!userId) {
        this.logger.error("Decoded token does not contain userId");
        client.disconnect(true);
        return;
      }
      const roomName = userRoomName(userId);
      client.join(roomName);
      this.logger.log(`User came online: ${userId}`);
      this.listeners.forEach(listener => listener.onUserCameOnline(userId, client));
    } catch (error) {
      this.logger.error(`Invalid token: ${formatError(error)}`);
      const baseDto: BaseDto = { message: "Invalid token" };
      client.emit("auth_error", baseDto);
      client.disconnect(true);
    }
  }

  handleDisconnect(/*client: Socket*/) {
    this.activeConnections--;
    this.logger.log(`Socket disconnected! Active connections: ${this.activeConnections}`);
  }

  //todo think about going to redis to reach other instances that have the user connected as well

  emitToUser<K extends keyof EventDtoMapping>(userId: string, event: K, data: EventDtoMapping[K]): void {
    if (!this.websocketService) {
      this.logger.warn("ws not initialized?");
      return;
    }

    const roomName = userRoomName(userId);

    // Count the number of clients in the room
    const { clientsInRoom, hasActiveUser } = this.checkUserConnected(userId);

    this.logger.verbose(`Attempting to send event "${event}" to user ${userId}`);
    this.logger.verbose(`User ${userId} has ${clientsInRoom} active session(s)`);

    if (hasActiveUser) {
      const broadcastOperator = this.websocketService?.to(roomName);
      this.logger.verbose(`Broadcasting event "${event}" to ${clientsInRoom} session(s) for user ${userId}`);
      broadcastOperator?.emit(event, data);
    } else {
      this.logger.verbose(`No active sessions found for user ${userId}. Event "${event}" not sent.`);
    }
  }

  private checkUserConnected(userId: string) {
    const roomName = userRoomName(userId);
    const clientsInRoom = this.websocketService?.sockets.adapter.rooms.get(roomName)?.size ?? 0;
    const hasActiveUser = clientsInRoom > 0;
    return { clientsInRoom, hasActiveUser };
  }

  public isUserConnected(userId: string) {
    const { clientsInRoom } = this.checkUserConnected(userId);
    return clientsInRoom > 0;
  }

  registerListener(listener: UserOnlineListener) {
    this.listeners.push(listener);
  }

  unregisterListener(listener: UserOnlineListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}
