import { UserRole } from "@prisma/client";
import { Roles } from "../../../../common/decorators";
import { JwtAuthGuard, RolesGuard } from "../../../../src/auth/guards";
import { EmptyDto } from "../../../../src/repositories/dtos/auth/empty.dto";
import { ClassType } from "./class-type";
import { applyDecorators, Delete, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
export function PrivateDeleteRequest<U>(
  path: string,
  RequestPostBodyClass: ClassType<U>[] | ClassType<U> | null,
  summary?: string,
  role?: UserRole
) {
  const requestBodyIsArray = Array.isArray(RequestPostBodyClass);
  const requestBodyType = requestBodyIsArray
    ? (RequestPostBodyClass as ClassType<U>[])[0]
    : (RequestPostBodyClass as ClassType<U>);

  const decorators = [
    Delete(path),
    Roles(role ?? UserRole.EMPLOYEE),
    ApiOkResponse({ type: EmptyDto, isArray: false }),
    ...(RequestPostBodyClass ? [ApiBody({ type: requestBodyType, isArray: requestBodyIsArray })] : []),
    ApiBearerAuth(),
    ApiForbiddenResponse(),
    ApiUnauthorizedResponse(),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiOperation({ summary })
  ];

  return applyDecorators(...decorators);
}
