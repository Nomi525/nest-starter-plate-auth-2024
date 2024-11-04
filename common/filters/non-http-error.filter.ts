import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type CommonErrorResp = {
  statusCode: number;
  status: number;
  message: string;
  url: string;
  exception?: Error;
  errMsg?: string;
  errStack?: string;
  errName?: string;
  statusName?: string;
};

@Catch()
export class NonHttpErrorFilter implements ExceptionFilter {
  logger = new Logger(NonHttpErrorFilter.name);

  constructor(private configService: ConfigService) {}

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const url = request.url;

    if (exception instanceof PrismaClientKnownRequestError) {
      const { status, message } = this.mapPrismaErrorToHttpStatus(exception);
      this.handleError(res, exception, status, message, url);
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === "object" && "message" in response
          ? Array.isArray(response.message)
            ? response.message.join("; ")
            : String(response.message)
          : exception.message;

      this.handleError(res, exception, status, message, url);
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      this.handleError(res, exception, status, exception.message, url);
    }
  }

  private handleError(
    res: Response,
    exception: Error | HttpException,
    status: HttpStatus,
    message: string,
    url: string
  ) {
    const logMessage = `${exception.name}: ${message} at ${url}`;
    const commonErrorResp: CommonErrorResp = {
      statusCode: status,
      status: status,
      message: logMessage,
      url: url
    };

    this.logger.error(logMessage);
    if (!(exception instanceof HttpException) || this.configService.get("ENABLE_ERROR_STACKTRACE") === "true") {
      commonErrorResp.exception = exception;
      commonErrorResp.errMsg = exception.message;
      commonErrorResp.errStack = exception.stack;
      commonErrorResp.errName = exception.name;
      commonErrorResp.statusName = status === HttpStatus.INTERNAL_SERVER_ERROR ? "Internal server error" : "Error";
      this.logger.error(exception.stack ?? "");
    }

    res.status(status).json(commonErrorResp);
  }

  private mapPrismaErrorToHttpStatus(exception: PrismaClientKnownRequestError): {
    status: HttpStatus;
    message: string;
  } {
    let status: HttpStatus;
    let message: string;

    switch (exception.code) {
      case "P2025": // Record not found
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        break;
      case "P2001": // Record not found
        status = HttpStatus.NOT_FOUND;
        message = `Record not found in the ${exception.meta?.modelName || "database"}.`;
        break;
      case "P2002": // Unique constraint failed
        status = HttpStatus.CONFLICT;
        message = `Unique constraint failed on the ${exception.meta?.target || "field"}.`;
        break;
      case "P2003": // Foreign key constraint failed
        status = HttpStatus.BAD_REQUEST;
        message = `Foreign key constraint failed on the ${exception.meta?.field_name || "field"}.`;
        break;
      case "P2023": // Invalid UUID
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid UUID format in the ${exception.meta?.modelName || "input"}: ${exception.meta?.message || exception.message}`;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = `Prisma Error (${exception.code}): ${exception.message}`;
        break;
    }

    return { status, message };
  }
}
