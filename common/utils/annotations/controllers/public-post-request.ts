import { applyDecorators, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation
} from "@nestjs/swagger";
import { ClassType } from "./class-type";

export function PublicPostRequest<T extends ClassType<unknown>, U extends ClassType<unknown>>(
  path: string,
  RequestPostBodyClass: U[] | U | null,
  ResponseClass: T[] | T | null,
  summary?: string
) {
  const responseIsArray = Array.isArray(ResponseClass);
  const requestBodyIsArray = Array.isArray(RequestPostBodyClass);
  const responseType = responseIsArray ? (ResponseClass as T[])[0] : (ResponseClass as T);
  const requestBodyType = requestBodyIsArray ? (RequestPostBodyClass as U[])[0] : (RequestPostBodyClass as U);

  const decorators = [
    Post(path),
    ...(ResponseClass
      ? [
          ApiOkResponse({
            type: responseType,
            isArray: responseIsArray
          })
        ]
      : [ApiNoContentResponse(), ApiCreatedResponse()]), // Support for empty responses
    RequestPostBodyClass && requestBodyType
      ? ApiBody({ type: requestBodyType, isArray: requestBodyIsArray })
      : undefined,
    ApiInternalServerErrorResponse(),
    ApiNotFoundResponse(),
    HttpCode(HttpStatus.OK)
  ];

  // Filter out any undefined decorators
  const validDecorators = decorators.filter(decorator => decorator !== undefined);

  if (summary) {
    validDecorators.push(ApiOperation({ description: summary, summary: summary }));
  }

  return applyDecorators(...(validDecorators as (MethodDecorator | ClassDecorator | PropertyDecorator)[]));
}
