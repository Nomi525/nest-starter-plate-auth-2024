import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { SwaggerUiOptions } from "@nestjs/swagger/dist/interfaces/swagger-ui-options.interface";
import backendVersion from "../backend-version";

export const setupSwagger = (app: INestApplication): void => {
  const env = process.env.NODE_ENV ?? "development";
  const configService = app.get(ConfigService);

  let documentBuilder = new DocumentBuilder()
    .setTitle("Nest Component API")
    .setDescription("Nest Demo 2024-25 Component API docs")
    .setVersion(backendVersion)
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Enter JWT token",
      in: "header"
    });

  const apiPath = configService.get<string>("API_PATH", "");
  if (apiPath.length) {
    /**
     * Make sure we signal the path our API is found under.
     */
    documentBuilder = documentBuilder.addServer(apiPath);
  }

  const swaggerConfig = documentBuilder.build();
  const swaggerDocOptions: SwaggerDocumentOptions = {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return `${controllerKey}#${methodKey}`;
    }
  };

  const swaggerCustomOptions = {
    swaggerOptions: {
      // Set the `formData` property to `true` to support `multipart/form-data`
      formData: true
    }
  };

  // downloadable JSON is available under /docs-json
  // downloadable YAML is available under /docs-yaml
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, swaggerDocOptions);

  const swaggerUiOptions: SwaggerUiOptions = {
    // SwaggerUiOptions
    tagsSorter: "alpha",
    operationsSorter: "alpha"
  };
  if (env === "development") {
    swaggerUiOptions.persistAuthorization = true;
  }

  SwaggerModule.setup("docs", app, swaggerDocument, {
    explorer: true,
    customSiteTitle: "Nest Component Api",
    ...swaggerCustomOptions, // Include the custom options in the setup function
    swaggerOptions: swaggerUiOptions
  });
};
