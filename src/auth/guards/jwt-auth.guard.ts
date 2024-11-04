import { ExecutionContext, HttpException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { ERRORS } from "../../auth/auth.const";

type InfoType = {
  stack?: string;
  name?: string;
  status?: number;
  message?: string;
};

const jwtErrorClasses = ["TokenExpiredError", "JsonWebTokenError", "Error", "No auth token"];

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  /**
   * @override
   */
  handleRequest<JwtPayloadDto>(
    err: unknown,
    user?: JwtPayloadDto,
    info?: InfoType,
    _context?: ExecutionContext
  ): JwtPayloadDto {
    if (user) {
      return user;
    }

    const searchElement = info ? (info.message ?? info.name) : undefined;
    if (searchElement && jwtErrorClasses.includes(searchElement)) {
      throw new UnauthorizedException(ERRORS.UNAUTHORIZED.NO_TOKEN1);
    }

    this.logger.error(err || info);
    if (err instanceof HttpException) {
      throw err;
    }
    throw new UnauthorizedException(ERRORS.UNAUTHORIZED.NO_TOKEN2);
  }
}
