import { applyDecorators, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { Roles } from "../../../../common/decorators";
import { JwtAuthGuard, RolesGuard } from "../../../../src/auth/guards";
import { ClassType } from "./class-type";
import { UserRole } from "@prisma/client";

export function PrivateGetRequest<T>(
  path: string,
  ResponseClass: ClassType<T> | ClassType<T>[],
  summary?: string,
  role?: UserRole
) {
  const isArray = Array.isArray(ResponseClass);
  const responseType = isArray ? ResponseClass[0] : ResponseClass;

  const decorators = [
    Get(path),
    Roles(role ? role : UserRole.User),
    ApiOkResponse(Object.assign({ type: responseType, isArray: isArray }, summary ? { description: summary } : {})),
    ApiInternalServerErrorResponse(),
    ApiNotFoundResponse(),
    HttpCode(HttpStatus.OK),
    ApiBearerAuth(),
    ApiForbiddenResponse(),
    ApiUnauthorizedResponse(),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiOperation({ summary })
  ];

  return applyDecorators(...decorators);
}
