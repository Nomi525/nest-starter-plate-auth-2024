import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../../../common/decorators";
import { UserRole } from "@prisma/client";
import { JwtPayloadDto } from "../../repositories/dtos/auth";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  private readonly logger = new Logger(RolesGuard.name);

  // Define the role hierarchy
  private readonly roleHierarchy: Record<UserRole, UserRole[]> = {
    Admin: ["Admin", "Manager", "User", "Guest"],
    Manager: ["User", "Guest"],
    // Hr: ["Hr", "User", "Guest"],
    User: ["User", "Guest"],
    Guest: ["Guest"]
  };

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const user = request.user as JwtPayloadDto;
    const requestUrl = request.originalUrl || request.url;
    const requestMethod = request.method;

    if (!user?.role) {
      this.logger.log(`Invalid access, no user role. Endpoint: ${requestMethod} ${requestUrl}`);
      return false;
    }

    const allowedRoles = this.roleHierarchy[user.role] || [];
    const userHasRole = requiredRoles.some(role => allowedRoles.includes(role));

    if (!userHasRole) {
      this.logger.log(
        `Invalid access, user role ${user.role} does not fulfill required ${JSON.stringify(requiredRoles)}. Endpoint: ${requestMethod} ${requestUrl}`
      );
    }

    return userHasRole;
  }
}
