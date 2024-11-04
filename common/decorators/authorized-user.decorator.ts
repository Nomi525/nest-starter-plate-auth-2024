import { GetPublicUserDto } from "../../src/repositories/dtos/users/get-public-user.dto";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthorizedUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as GetPublicUserDto;
});
