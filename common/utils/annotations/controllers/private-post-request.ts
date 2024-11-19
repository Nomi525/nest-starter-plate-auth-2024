import { applyDecorators, Post, UseGuards } from "@nestjs/common";
import { Roles } from "../../../../common/decorators";
import { UserRole } from "@prisma/client";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { JwtAuthGuard, RolesGuard } from "../../../../src/auth/guards";
import { ClassType } from "./class-type";

export function PrivatePostRequest<T, U>(
  path: string,
  RequestPostBodyClass: ClassType<U>[] | ClassType<U> | null,
  ResponseClass: ClassType<T>[] | ClassType<T> | null,
  summary: string,
  role?: UserRole
) {
  const responseIsArray = Array.isArray(ResponseClass);
  const requestBodyIsArray = Array.isArray(RequestPostBodyClass);
  const responseType = responseIsArray ? (ResponseClass as ClassType<T>[])[0] : (ResponseClass as ClassType<T>);
  const requestBodyType = requestBodyIsArray
    ? (RequestPostBodyClass as ClassType<U>[])[0]
    : (RequestPostBodyClass as ClassType<U>);

  const decorators = [
    Post(path),
    Roles(role ?? UserRole.EMPLOYEE),
    ...(ResponseClass
      ? [
          ApiOkResponse({
            type: responseType,
            isArray: responseIsArray
          })
        ]
      : [ApiNoContentResponse(), ApiCreatedResponse()]),
    ...(RequestPostBodyClass ? [ApiBody({ type: requestBodyType, isArray: requestBodyIsArray })] : []),
    ApiBearerAuth(),
    ApiForbiddenResponse(),
    ApiUnauthorizedResponse(),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiOperation({ description: summary, summary: summary })
  ];
  return applyDecorators(...decorators);
}
