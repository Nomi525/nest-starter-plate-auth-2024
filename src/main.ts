// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";
// import { HttpExceptionFilter } from "./core/filters/exception.filter";
// import { createDocument } from "./swagger/swagger";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalFilters(new HttpExceptionFilter());
//   // app.useGlobalPipes(new EmailValidationPipe())
//   createDocument(app);
//   await app.listen(3000);
// }
// void bootstrap();

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
// Import your environment-specific modules
import * as dotenv from "dotenv";
import * as express from "express";
// import session from "express-session";
import * as path from "path";
import { getMyEnv } from "../environment";
import backendVersion from "../backend-version";
import { setupCors } from "./../middlewares/setupCors";
import { setupModuleHotReload } from "./../middlewares/setupModuleHotReload";
import { setupValidationPipes } from "./../middlewares/setupValidationPipes";
import { setupSwagger } from "./../middlewares/setupSwagger";

dotenv.config();
async function bootstrap() {
  const PORT = parseInt(process.env.PORT ?? "3000", 10);
  const { module: appModule } = getMyEnv();

  const app = await NestFactory.create(appModule, {
    logger: ["error", "warn", "log", "debug" /*, "verbose"*/],
    rawBody: true
  });

  const logger = app.get(Logger);

  app.use(express.static(path.join(__dirname, "public")));

  app.useGlobalPipes(new ValidationPipe());
  // Custom JSON serializer to handle BigInt

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const originalJson = res.json;
    res.json = function json(data: unknown) {
      return originalJson.call(
        this,
        JSON.parse(JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value)))
      );
    };
    next();
  });

  // Global error handling for unhandled rejections
  process.on("unhandledRejection", (reason: unknown) => {
    const msg = `Unhandled Promise Rejection: ${reason}`;
    logger.error(msg);
  });

  setupCors(app);
  setupSwagger(app);
  setupValidationPipes(app);
  setupModuleHotReload(module, app);

  // Start the application
  await app.listen(PORT);
  logger.log(`Started up Version ${backendVersion} at http://localhost:${PORT}/docs `, "main");
}

void bootstrap();
