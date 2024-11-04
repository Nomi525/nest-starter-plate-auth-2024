import { applyDecorators, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { ClassType } from "./class-type";

type ResponseType = ClassType<unknown> | "image/png";

export function PublicGetRequest(path: string, ResponseClass: ResponseType | ResponseType[] | null, summary?: string) {
  const isArray = Array.isArray(ResponseClass);
  let responseType: ResponseType | undefined;

  if (isArray && Array.isArray(ResponseClass)) {
    responseType = ResponseClass[0];
  } else if (ResponseClass instanceof Function) {
    responseType = ResponseClass;
  }
  let apiOkResponseDecorator: typeof ApiOkResponse;

  if (typeof responseType === "string" && responseType === "image/png") {
    // Handle binary (PNG image) response
    apiOkResponseDecorator = ApiOkResponse({
      description: summary ?? "Description of the response of this get request",
      content: {
        "image/png": {
          schema: {
            type: "string",
            format: "binary"
          }
        }
      }
    });
  } else {
    // Handle regular response types
    apiOkResponseDecorator = ApiOkResponse(
      responseType
        ? {
            type: responseType as ClassType<unknown>,
            isArray,
            description: summary ?? ""
          }
        : undefined
    );
  }

  const decorators = [
    Get(path),
    apiOkResponseDecorator,
    ApiInternalServerErrorResponse(),
    ApiNotFoundResponse(),
    HttpCode(HttpStatus.OK)
  ].filter(Boolean);

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }

  return applyDecorators(...decorators);
}
