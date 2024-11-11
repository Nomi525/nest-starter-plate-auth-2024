import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { RepositoriesModule } from "../repositories";
import { SessionSerializer } from "./guards/serializer";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtManagmentService } from "../auth/services/jwt-managment.service";
import { AuthController } from "./auth.controller";

const jwt = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER
  }
};

@Module({
  imports: [
    RepositoriesModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: jwt.secret,
          signOptions: jwt.signOptions
        };
      }
    }),
    PassportModule.register({
      defaultStrategy: "jwt",
      property: "user",
      session: true
    })
  ],
  // controllers: [AuthController],
  exports: [JwtModule, PassportModule, JwtManagmentService],
  providers: [JwtStrategy, SessionSerializer, JwtManagmentService]
})
export class AuthModule {}
