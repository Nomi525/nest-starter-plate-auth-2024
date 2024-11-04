import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayloadDto } from "../../repositories/dtos/auth";
import { JwtManagmentService } from "../../auth/services/jwt-managment.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtManagmentService: JwtManagmentService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '42595890485202384592485098234590'
    });
  }

  async validate(payload: JwtPayloadDto) {
    return await this.jwtManagmentService.checkIfValidOrThrow(payload);
  }
}
