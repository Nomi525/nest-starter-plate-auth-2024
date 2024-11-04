import { Body, Catch, Controller, NotFoundException, Param } from "@nestjs/common";
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { PrivatePostRequest } from "../../common/utils/annotations/controllers/private-post-request";
import {
  ChangePasswordDto,
  ConfirmEmailPayloadDto,
  JwtPayloadDto,
  JwtResponseDto,
  LoginPayloadDto,
  LogoutRequestDto,
  NonceDto,
  RefreshTokenRequestDto,
  RegisterPayloadDto,
  SetPasswordUsingWalletDto,
  SiweMessageDto,
  UpgradeGuestPayloadDto
} from "../repositories/dtos/auth";
import { UserRole } from "@prisma/client";
import { PrivateGetRequest } from "../../common/utils/annotations/controllers/private-get-request";
import { PublicPostRequest } from "../../common/utils/annotations/controllers/public-post-request";
import { RegisterResultDto } from "../repositories/dtos/auth/register-result.dto";
import { ResendEmailsDto } from "../repositories/dtos/auth/request-with-email.dto";
import { GetPrivateUserDto } from "../repositories/dtos/users/get-private-user.dto";
import { UpdateUserDto } from "../repositories/dtos/users/update-user.dto";
import { UserUpdateResultDto } from "../repositories/dtos/users/user-update-result.dto";
import { EmptyDto } from "../repositories/dtos/auth/empty.dto";
import { PublicGetRequest } from "../../common/utils/annotations/controllers/public-get-request";
import { AuthorizedUser } from "../../common/decorators";
import { AuthService } from "./services/auth.service";

@ApiTags("auth")
@Catch()
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse()
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicPostRequest("login", LoginPayloadDto, JwtResponseDto)
  async login(@Body() payload: LoginPayloadDto): Promise<JwtResponseDto> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.login(user);
  }

  /*this works like "magic login" with userId and code.*/
  @PublicPostRequest("confirmEmail", ConfirmEmailPayloadDto, JwtResponseDto, "confirms an email")
  async confirmEmail(@Body() payload: ConfirmEmailPayloadDto): Promise<JwtResponseDto> {
    return await this.authService.confirmCode(payload);
  }

  @PublicPostRequest("register", RegisterPayloadDto, RegisterResultDto)
  async register(@Body() payload: RegisterPayloadDto): Promise<RegisterResultDto> {
    return await this.authService.register(payload);
  }

  @PrivatePostRequest(
    "upgradeGuest",
    UpgradeGuestPayloadDto,
    RegisterResultDto,
    "Upgrades a Guest to a full User",
    "Guest"
  )
  async upgradeGuest(
    @Body() payload: UpgradeGuestPayloadDto,
    @AuthorizedUser() user: JwtPayloadDto
  ): Promise<RegisterResultDto> {
    return await this.authService.upgradeGuest(payload, user.sub);
  }

  @PublicPostRequest("loginAsGuest", EmptyDto, JwtResponseDto)
  async loginAsGuest(): Promise<JwtResponseDto> {
    return await this.authService.createGuest();
  }

  @PrivatePostRequest("logout", LogoutRequestDto, null, "Ends a user Session", UserRole.Guest)
  async logout(@Body() payload: LogoutRequestDto): Promise<void> {
    await this.authService.logout(payload.access_token, payload.refresh_token);
  }

  @PublicPostRequest(
    "refresh-auth-token",
    RefreshTokenRequestDto,
    JwtResponseDto,
    "submits a token from a mail and loggs user in. (possibly skipping wallet creating)"
  )
  async updateAccessToken(@Body() payload: RefreshTokenRequestDto): Promise<JwtResponseDto> {
    return await this.authService.updateSession(payload.refresh_token);
  }

  @PrivatePostRequest(
    "admin-resend-email",
    ResendEmailsDto,
    null,
    "Sends the Confirmation Code email again to a user",
    "Admin"
  )
  async resendEmailAdmin(@Body() payload: ResendEmailsDto): Promise<void> {
    await this.authService.resendCodeEmail(payload);
  }

  @PrivatePostRequest("resend-email", EmptyDto, null, "Sends the Confirmation Code email again to a user", "User")
  async resendEmail(@AuthorizedUser() user: JwtPayloadDto): Promise<void> {
    await this.authService.resendCodeEmail({ email: user.email });
  }

  //TODO move user data to own controller
  @PrivatePostRequest("user/data", UpdateUserDto, UserUpdateResultDto, "Updates a Users data")
  async updateUserData(
    @Body() payload: UpdateUserDto,
    @AuthorizedUser() user: JwtPayloadDto
  ): Promise<UserUpdateResultDto> {
    if (user.sub !== payload.id) {
      throw new NotFoundException("onboarding code not found");
    }
    return await this.authService.updateUserData(payload);
  }

  @PrivateGetRequest("user/data", GetPrivateUserDto, "Updates a Users data", UserRole.Guest)
  async geteUserData(@AuthorizedUser() user: JwtPayloadDto): Promise<GetPrivateUserDto> {
    return await this.authService.getUserData(user.sub);
  }

  @PrivatePostRequest(
    "change-password",
    ChangePasswordDto,
    null,
    "Allows a user to change their password",
    UserRole.User
  )
  async changePassword(@Body() payload: ChangePasswordDto, @AuthorizedUser() user: JwtPayloadDto): Promise<void> {
    await this.authService.changePassword(user, payload);
  }

  @PrivatePostRequest(
    "reset-password",
    SetPasswordUsingWalletDto,
    null,
    "Allows a user to change their password",
    UserRole.User
  )
  async resetPassword(
    @Body() payload: SetPasswordUsingWalletDto,
    @AuthorizedUser() user: JwtPayloadDto
  ): Promise<void> {
    await this.authService.resetPassword(user, payload);
  }

  @PublicGetRequest("generate-siwe-nonce/:walletAddress", NonceDto, "obtains the next nonce for SIWE")
  async generateSiweNonce(@Param("walletAddress") walletAddress: string): Promise<NonceDto> {
    const nonce = await this.authService.generateSiweNonce(walletAddress);
    return { nonce };
  }

  @PublicPostRequest("sign-in-with-ethereum", SiweMessageDto, JwtResponseDto, "signs in with ethereum")
  async signInWithEthereum(@Body() payload: SiweMessageDto): Promise<JwtResponseDto> {
    return await this.authService.signInWithEthereum(payload);
  }
}
