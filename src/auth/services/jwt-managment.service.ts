import { ERRORS } from "../../auth/auth.const";
import { JwtPayloadDto, JWTVerifyResultDto } from "../../repositories/dtos/auth";
import { Injectable, Logger, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { isUUID } from "class-validator";
import { getDateInSecs } from "../../../common/utils";
import { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { PrismaService } from "../../repositories/prisma.service";
import { ImageToken } from "../../auth/services/image.token";

export type TJwtTokens = {
  accessToken: string;
  refreshToken: string;
};

type VerifiedImageToken = JWTVerifyResultDto & ImageToken;

@Injectable()
export class JwtManagmentService {
  private readonly logger = new Logger(JwtManagmentService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  async checkIfValidOrThrow(payload: JwtPayload) {
    if (!payload) {
      throw new UnprocessableEntityException("Cannot check auth session for the user");
    }

    const { sub: userId, jti, exp: expirationDateInSec } = payload;

    if (!userId || !isUUID(userId, 4) || !jti) {
      throw new UnprocessableEntityException("Invalid access token");
    }

    const currentAccessToken = await this.prisma.authToken.findUnique({
      where: { id: jti }
    });
    if (!currentAccessToken) {
      throw new UnauthorizedException(ERRORS.UNAUTHORIZED.TOKEN_REVOKED);
    }

    const nowInSecs = getDateInSecs(new Date());
    if (expirationDateInSec && expirationDateInSec <= nowInSecs) {
      throw new UnauthorizedException(ERRORS.UNAUTHORIZED.TOKEN_EXPIRED);
    }

    return payload;
  }

  async generateTokens(user: User, regenerateRefreshToken: boolean = true): Promise<TJwtTokens> {
    const accessTokenParams = {
      secret: this.configService.get("JWT_SECRET"),
      expiresIn: this.configService.get("JWT_EXPIRES_IN")
    };

    const refreshTokenParams = {
      secret: this.configService.get("JWT_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN")
    };

    const authTokenId = await this.createAuthTokenEntity(user.id);

    const userToSign = { email: user.email ?? "", role: user.role, id: user.id };
    const signPayload = new JwtPayloadDto(userToSign, authTokenId);
    const signPayloadAsPlainObject = JSON.parse(JSON.stringify(signPayload));

    const accessTokenSignOptions = {
      secret: accessTokenParams.secret,
      expiresIn: accessTokenParams.expiresIn
    };
    const refreshTokenSignOptions = {
      secret: refreshTokenParams.secret,
      expiresIn: refreshTokenParams.expiresIn
    };

    const accessToken = await this.jwtService.signAsync(signPayloadAsPlainObject, accessTokenSignOptions);
    const refreshToken = regenerateRefreshToken
      ? await this.jwtService.signAsync(signPayloadAsPlainObject, refreshTokenSignOptions)
      : "";
    return {
      accessToken,
      refreshToken
    };
  }

  private async createAuthTokenEntity(userId: string): Promise<string> {
    if (!userId) {
      throw new UnprocessableEntityException("Cannot create session for the user");
    }

    const authToken = await this.prisma.authToken.create({
      data: {
        user_id: userId
      },
      select: {
        id: true
      }
    });
    return authToken.id;
  }

  async removeAuthTokenEntityById(jti: string): Promise<void> {
    if (!jti) {
      throw new UnprocessableEntityException("Cannot detect the sessions for the user");
    }
    await this.prisma.authToken.delete({ where: { id: jti } });
  }

  async decodeImageToken(token: string): Promise<VerifiedImageToken> {
    const result = await this.jwtService.verifyAsync<VerifiedImageToken>(token);

    if (result.path) {
      return result;
    }
    throw new UnprocessableEntityException("Invalid image token");
  }

  async decodeToken(token: string): Promise<JWTVerifyResultDto> {
    try {
      const result = await this.jwtService.verifyAsync(token);
      return result;
    } catch (err) {
      const message = err instanceof TokenExpiredError ? "Refresh token expired" : "Refresh token malformed";
      throw new UnprocessableEntityException(message);
    }
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnprocessableEntityException("Refresh token malformed");
    }

    const user = await this.resolveRefreshToken(refreshToken);
    const regenerateRefreshToken = false;
    const tokens = await this.generateTokens(user, regenerateRefreshToken);

    return { user: user, accessToken: tokens.accessToken };
  }

  public async resolveRefreshToken(encodedRefreshToken: string): Promise<User> {
    const payload = await this.decodeToken(encodedRefreshToken);
    if (!payload?.jti) {
      throw new UnprocessableEntityException("Refresh token malformed");
    }

    const token = await this.prisma.authToken.findUnique({
      where: { id: payload.jti }
    });
    if (!token) {
      throw new UnprocessableEntityException("Refresh token not found");
    }

    // if (token.is_revoked) {
    // 	throw new UnprocessableEntityException('Refresh token revoked');
    // }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });
    if (!user) {
      throw new UnprocessableEntityException("Refresh token malformed");
    }

    return user;
  }

  public async generateImageToken(
    imageId: string,
    userId: string,
    originalExtension: string,
    fileRole: string
  ): Promise<string> {
    const payload: ImageToken = {
      path: `${imageId}.webp`,
      userId: userId,
      originalExtension: originalExtension,
      fileRole
    };

    return this.jwtService.sign(payload, { expiresIn: Math.floor(Date.now() / 1000) + 5 * 60 });
  }
}
