import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    if (Logger.isLevelEnabled("debug")) {
      const startTime: number = Date.now();

      res.on("finish", () => {
        const elapsedTime = Date.now() - startTime!;
        const paddedTime = elapsedTime.toString().padStart(4, " ");
        this.logger.debug(`${req.method} ${paddedTime}ms ${req.originalUrl}`);
      });
    }
    next();
  }
}
