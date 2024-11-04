import { INestApplication, ValidationPipe } from "@nestjs/common";

export const setupValidationPipes = (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      skipUndefinedProperties: true
    })
  );
};
