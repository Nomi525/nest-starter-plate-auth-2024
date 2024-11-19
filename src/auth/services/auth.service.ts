import { UserRole } from ".prisma/client";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
  UnprocessableEntityException
} from "@nestjs/common";
import { User, UserConfirmation } from "@prisma/client";
import { SiweMessage } from "siwe";
import { hashPassword, verifyHash } from "../../../common/utils";
import { createFreeCode } from "../../../common/utils/create-free.code";
import { EmailService } from "../../email/email.service";
import {
  ChangePasswordDto,
  ConfirmEmailPayloadDto,
  JwtPayloadDto,
  JwtResponseDto,
  LoginPayloadDto,
  RegisterPayloadDto,
  UpgradeGuestPayloadDto
} from "../../repositories/dtos/auth";
import { RegisterResultDto } from "../../repositories/dtos/auth/register-result.dto";
import { ResendEmailsDto } from "../../repositories/dtos/auth/request-with-email.dto";
import { GetPrivateUserDto } from "../../repositories/dtos/users/get-private-user.dto";
import { UpdateUserDto } from "../../repositories/dtos/users/update-user.dto";
import { UserUpdateResultDto } from "../../repositories/dtos/users/user-update-result.dto";
import { PrismaService } from "../../repositories/prisma.service";
import { UserNotificationGateway } from "../../websocket/user-notification-gateway.service";
import { JwtManagmentService } from "./jwt-managment.service";
import { parseDateString } from "../../../common/utils/dateFormat";

type UserWithConfirmation = User & {
  UserConfirmation: UserConfirmation | null;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtManagmentService: JwtManagmentService,
    private emailService: EmailService,
    // private blockchainService: BlockchainService,
    private readonly userNotificationGateway: UserNotificationGateway
  ) {}

  /**
   * Reset the password using a signed SIWE message.
   * Verifies the SIWE message, and if valid, updates the user's password.
   */
  // async resetPassword(user: JwtPayloadDto, payload: SetPasswordUsingWalletDto): Promise<void> {
  //   const { siweMessageDto, newAuthHash, server_salt } = payload;

  //   // Step 1: Verify the SIWE message
  //   const siweMessage = new SiweMessage(siweMessageDto.message);
  //   const verificationResult = await siweMessage.verify({ signature: siweMessageDto.signature });

  //   if (!verificationResult.success) {
  //     throw new BadRequestException("Invalid SIWE signature");
  //   }

  //   // Step 2: Ensure that the signer address matches the user's Ethereum address
  //   // const signerAddress = siweMessage.address;
  //   const userId = user.sub;
  //   // const userWithWallet = await this.prisma.safeWallet.findFirst({
  //   //   where: { user_id: userId },
  //   //   include: { user: true }
  //   // });

  //   // if (!userWithWallet || userWithWallet.user_EOA_address !== signerAddress) {
  //   //   throw new UnauthorizedException(ERRORS.UNAUTHORIZED.WALLET_MISMACH);
  //   // }

  //   // Step 3: Hash the new password
  //   const newHashedPassword = await hashPassword(newAuthHash);

  //   // Step 4: Update the user's password and server salt in the database
  //   await this.prisma.user.update({
  //     where: { id: userId },
  //     data: { pwd_hash: newHashedPassword }
  //   });

  //   // await this.prisma.safeWallet.update({
  //   //   where: { user_id: userId },
  //   //   data: { server_salt }
  //   // });
  //   this.invalidateOtherUserSessions(user);
  // }

  // async signInWithEthereum(payload: SiweMessageDto): Promise<JwtResponseDto> {
  //   const { message, signature } = payload;

  //   const siweMessage = new SiweMessage(message);

  //   // Verify the SIWE message with the provided signature
  //   const verificationResult = await siweMessage.verify({ signature });
  //   if (!verificationResult.success) {
  //     throw new BadRequestException("Invalid SIWE signature");
  //   }

  //   // Extract the Ethereum address (EOA) from the message
  //   const signerAddress = siweMessage.address;

  //   // Check if the user exists in the database using the EOA (now using SafeWallet)
  //   const userWithWallet = await this.prisma.safeWallet.findFirst({
  //     where: {
  //       user_EOA_address: signerAddress
  //     },
  //     include: { user: true }
  //   });

  //   if (!userWithWallet?.user) {
  //     throw new NotFoundException("User with this Ethereum address not found");
  //   }

  //   // Validate nonce to prevent replay attacks
  //   if (userWithWallet.siweNonce !== siweMessage.nonce) {
  //     throw new BadRequestException("Invalid nonce");
  //   }

  //   // Invalidate the nonce after use (set it to null)
  //   await this.prisma.safeWallet.update({
  //     where: { id: userWithWallet.id },
  //     data: { siweNonce: null }
  //   });

  //   // Generate JWT tokens for the user
  //   const { accessToken, refreshToken } = await this.jwtManagmentService.generateTokens(userWithWallet.user);

  //   return {
  //     id: userWithWallet.user.id,
  //     email: userWithWallet.user.email ?? "",
  //     email_confirmed: userWithWallet.user.email_confirmed,
  //     access_token: accessToken,
  //     refresh_token: refreshToken,
  //     role: userWithWallet.user.role
  //   };
  // }

  // async generateSiweNonce(walletAddress: string): Promise<string> {
  //   const nonce = ethers.hexlify(ethers.randomBytes(16));

  //   await this.prisma.safeWallet.update({
  //     where: { user_EOA_address: walletAddress },
  //     data: { siweNonce: nonce }
  //   });

  //   return nonce;
  // }

  async changePassword(authUser: JwtPayloadDto, payload: ChangePasswordDto): Promise<void> {
    const { oldAuthHash, newAuthHash } = payload;
    const user_id = authUser.sub;

    const user = await this.prisma.user.findUnique({ where: { id: user_id } });
    if (!user?.pwd_hash) {
      throw new NotFoundException("User not found or password is not set.");
    }

    // Verify the old password
    const isOldPasswordValid = await verifyHash(oldAuthHash, user.pwd_hash);
    if (!isOldPasswordValid) {
      throw new BadRequestException("Old password is incorrect.");
    }

    // Hash the new password
    const newHashedPassword = await hashPassword(newAuthHash);

    // Update the user with the new password hash
    await this.prisma.user.update({
      where: { id: user_id },
      data: { pwd_hash: newHashedPassword }
    });

    // await this.prisma.safeWallet.update({ data: { server_salt }, where: { user_id } });
    this.invalidateOtherUserSessions(authUser);
  }

  async validateUser(payload: LoginPayloadDto): Promise<User> {
    if (!payload?.email?.trim() || !payload.password?.trim()) {
      throw new BadRequestException();
    }
    const { email, password } = payload;
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() }
    });

    console.log(user, "user12");
    

    if (!user) {
      throw this.throwAuthError(payload);
    } else if (!user?.pwd_hash) {
      throw new Error(`no pwd_hash stored with user`);
    } else {
      const isPasswordVerified = await verifyHash(password, user.pwd_hash);
      console.log(isPasswordVerified, "isPasswordVerified");

      if (!isPasswordVerified) {
        throw this.throwAuthError(payload);
      }
    }
    return user;
  }

  async resendCodeEmail(payload: ResendEmailsDto) {
    if (payload.email) {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          email: {
            contains: payload.email.toLowerCase().trim(),
            mode: "insensitive"
          }
        },
        include: { UserConfirmation: true }
      });
      if (!user) {
        this.throwAuthError(payload);
      }

      let userConfirmation: UserConfirmation | null = user.UserConfirmation;

      // If UserConfirmation doesn't exist, create a new one
      if (!userConfirmation) {
        const confirmEmailCode = await createFreeCode();
        userConfirmation = await this.prisma.userConfirmation.create({
          data: {
            user_id: user.id,
            confirm_email_code: confirmEmailCode,
            confirm_email_code_sent: new Date()
          }
        });
      }

      // Send confirmation email
      await this.emailService.sendConfirmCodeMail(user, userConfirmation);

      return {
        message: `Confirmation Code sent to ${user.email}`
      };
    }
  }

  async login(userFromDb: User): Promise<JwtResponseDto> {
    if (!userFromDb.email) {
      throw new BadRequestException("tried to log in with user that has no email");
    }
    const { accessToken, refreshToken } = await this.jwtManagmentService.generateTokens(userFromDb);
    return {
      message: "You are successfully logged in",
      id: userFromDb.id,
      email: userFromDb.email,
      email_confirmed: userFromDb.email_confirmed,
      access_token: accessToken,
      refresh_token: refreshToken,
      role: userFromDb.role
    };
  }

  async upgradeGuest(payload: UpgradeGuestPayloadDto, userId: string): Promise<RegisterResultDto> {
    const { first_name, last_name, auth_pass, email } = payload;
    const passwordHash = await hashPassword(auth_pass);
    //todo check email does not yet exist
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        first_name,
        last_name,
        email: email,
        pwd_hash: passwordHash,
        role: UserRole.EMPLOYEE
      }
    });

    if (!updatedUser.email) {
      throw new BadRequestException("email must be provided");
    }

    const emailConfirmed = updatedUser.email_confirmed;

    if (!emailConfirmed) {
      const confirmEmailCode = await createFreeCode();
      const uc = await this.prisma.userConfirmation.update({
        where: { user_id: updatedUser.id },
        data: { confirm_email_code: confirmEmailCode }
      });
      // await this.emailService.sendConfirmCodeMail(updatedUser, uc);
    }

    const tokens = await this.jwtManagmentService.generateTokens(updatedUser);

    return {
      id: updatedUser.id,
      needs_confirm_code: !emailConfirmed,
      quickLoginInfo: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        email_confirmed: updatedUser.email_confirmed,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      }
    };
  }

  async register(payload: RegisterPayloadDto): Promise<RegisterResultDto> {
    const alreadyExistingUser = await this.prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (alreadyExistingUser) {
      throw new UnprocessableEntityException(`${payload.email} already exists`);
    }

    const passwordHash = await hashPassword(payload.pass_hash);

    const [user, userConfirmation] = await this.createUserAndConfirmation(payload, passwordHash);

    console.log(userConfirmation, "userConfirmation");

    // await this.emailService.sendConfirmCodeMail(user, userConfirmation);

    const { accessToken, refreshToken } = await this.jwtManagmentService.generateTokens(user);
    const quickLoginData = {
      ...user,
      access_token: accessToken,
      refresh_token: refreshToken
    };

    // await this.blockchainService.scheduleSafeWalletCreation({
    //   user,
    //   payload,
    //   userId: user.id,
    //   note: `EOA ${payload.user_EOA_address} ${payload.first_name} ${payload.last_name} ${payload.role}`
    // });
    if (!quickLoginData.email) {
      throw new BadRequestException("tried to log in with employee/manager that has no email");
    }
    return {
      id: user.id,
      message: "Registration successful",
      quickLoginInfo: {
        email: quickLoginData.email,
        role: quickLoginData.role,
        access_token: quickLoginData.refresh_token,
        email_confirmed: quickLoginData.email_confirmed,
        refresh_token: quickLoginData.refresh_token,
        id: quickLoginData.id
      }
    };
  }

  async confirmCode(payload: ConfirmEmailPayloadDto): Promise<JwtResponseDto> {
    if (!payload.id) {
      throw new PreconditionFailedException("should never happen, Validation pipeline failed");
    }
    const userId = payload.id;

    const alreadyExistingUser: UserWithConfirmation = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      include: { UserConfirmation: true }
    });

    const allowPrefixTesting = true;
    const matchesPrefix = allowPrefixTesting && payload.confirm_code.startsWith("AAA");

    const isCorrectEmailCode = matchesPrefix || this.matchesConfirmCode(payload, alreadyExistingUser);

    if (!isCorrectEmailCode) {
      throw new UnprocessableEntityException("wrong Confirmation Code");
    }

    if (isCorrectEmailCode && !alreadyExistingUser.email_confirmed) {
      await this.prisma.user.update({
        data: { email_confirmed: true },
        where: { id: alreadyExistingUser.id }
      });
      alreadyExistingUser.email_confirmed = true;
    }
    const { accessToken, refreshToken } = await this.jwtManagmentService.generateTokens(alreadyExistingUser);

    this.userNotificationGateway.emitToUser(alreadyExistingUser.id, "emailWasConfirmed", {
      message: "Your email was successfully verified"
    });

    if (!alreadyExistingUser.email) {
      throw new BadRequestException("only a user with email can confirm it");
    }

    return {
      role: alreadyExistingUser.role,
      message: "Email code confirmed successfully",
      id: alreadyExistingUser.id,
      email: alreadyExistingUser.email,
      email_confirmed: alreadyExistingUser.email_confirmed,
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  private matchesConfirmCode(payload: ConfirmEmailPayloadDto, alreadyExistingUser: UserWithConfirmation): boolean {
    if (!alreadyExistingUser || !alreadyExistingUser.UserConfirmation) {
      throw new UnprocessableEntityException("unable to verify");
    }
    return payload.confirm_code === alreadyExistingUser.UserConfirmation.confirm_email_code;
  }

  async logout(accessToken: string, refreshToken: string): Promise<void> {
    if (!accessToken || !refreshToken) {
      return;
    }

    const decodedAccessToken = await this.jwtManagmentService.decodeToken(accessToken);

    if (decodedAccessToken?.jti) {
      await this.jwtManagmentService.removeAuthTokenEntityById(decodedAccessToken.jti);
    }
  }

  async updateSession(refreshToken: string): Promise<JwtResponseDto> {
    const { accessToken, user } = await this.jwtManagmentService.createAccessTokenFromRefreshToken(refreshToken);

    return {
      id: user.id,
      role: user.role,
      email: user.email ?? "",
      email_confirmed: user.email_confirmed,
      access_token: accessToken,
      refresh_token: refreshToken,
      message: "token successfully refreshed"
    };
  }

  async updateUserData(payload: UpdateUserDto): Promise<UserUpdateResultDto> {
    const user = await this.prisma.user.findFirstOrThrow({ where: { id: payload.id } });
    if (!user) throw new NotFoundException("user does not exist");
    if (!user.email) throw new NotFoundException("user does not have an email");
    const needsConfirm = user.email.toLowerCase() === payload.email.toLowerCase();
    await this.prisma.user.update({
      data: {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email
      },
      where: { id: payload.id }
    });
    return { id: user.id, needs_confirm_code: needsConfirm };
  }

  async getUserData(userId: string): Promise<unknown> {
    const userProfileData = await this.prisma.user.findFirstOrThrow({ where: { id: userId

     },
    include:
     {
      knownLanguages: true,
      EmployeeShift: true,
      EmployeeActivity: true,
      Break: true,
      Calls: true,
      AssignedCalls: true,
    }
   });
    /*even guests who don't have names and emails might have a profile*/
    // return {
    //   id: userProfileData.id,
    //   first_name: userProfileData.first_name ?? "",
    //   last_name: userProfileData.last_name ?? "",
    //   email: userProfileData.email ?? "",
    //   email_confirmed: userProfileData.email_confirmed,
    //   role: userProfileData.role
    // };
    return userProfileData;
  }

  async createGuest(): Promise<JwtResponseDto> {
    const guestUser = await this.prisma.user.create({
      data: {
        email: "",
        first_name: "Anonymous",
        last_name: "",
        role: UserRole.GUEST,
        pwd_hash: "Guest"
      }
    });

    await this.prisma.userConfirmation.create({
      data: { user_id: guestUser.id }
    });

    const { accessToken, refreshToken } = await this.jwtManagmentService.generateTokens(guestUser);

    return {
      id: guestUser.id,
      role: UserRole.GUEST,
      email: "",
      email_confirmed: false,
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  private invalidateOtherUserSessions(user: JwtPayloadDto) {
    const userId = user.sub;
    this.prisma.authToken.deleteMany({ where: { user_id: userId, NOT: { id: user.jti } } });

    /*todo invalidate all user sessions not matching the jti*/
    this.userNotificationGateway.emitToUser(userId, "sessionReset", {
      message: "Your password has been successfully reset",
      remainingAuthId: user.jti
    });
  }

  private throwAuthError(payload: { email?: string }) {
    const extraInfo = payload ? `for ${payload.email}` : "";
    return new BadRequestException(`username or password wrong ${extraInfo}`);
  }

  private async createUserAndConfirmation(
    payload: RegisterPayloadDto,
    passwordHash: string
  ): Promise<[User, UserConfirmation]> {
    const [user, userConfirmation] = await this.prisma.$transaction(async prisma => {
      let user: User;

      if (payload.role === UserRole.MANAGER) {
        const managerName = payload?.manager_name;
        if (!managerName) {
          throw new UnprocessableEntityException(`manager name must be specified`);
        }
        user = await prisma.user.create({
          data: {
            email: payload.email,
            first_name: managerName,
            // last_name: payload.last_name,
            empId: payload.empId,
            pwd_hash: passwordHash,
            email_confirmed: false,
            role: UserRole.MANAGER,
            knownLanguages: {
              connect: payload.languageIds.map(id => ({ id })),
            },  
            EmployeeShift: {
              create: {
                shift_start_date: parseDateString(payload.shift_start_date),
                shift_end_date: parseDateString(payload.shift_end_date),
                shift_duration: payload.shift_duration, // Replace with calculated duration if needed
                employment_active: true,
                employment_start_date: parseDateString(payload.employment_start_date),
              }
            },
           }
        });

       
        // await prisma.user.create({
        //   data: {
        //     id: user.id,
        //     first_name: managerName,
        //     created_at: new Date()
        //   }
        // });
      } else {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            first_name: payload.first_name,
            last_name: payload.last_name,
            empId: payload.empId,
            pwd_hash: passwordHash,
            email_confirmed: false,
            role: UserRole.EMPLOYEE,
            knownLanguages: {
              // connect: payload.languageIds.map((item: LanguageKnowsDto) => ({ id: item.id })),
              connect: payload.languageIds.map(id => ({ id }))
            },
            EmployeeShift: {
              create: {
                shift_start_date: parseDateString(payload.shift_start_date),
                shift_end_date: parseDateString(payload.shift_end_date),
                shift_duration: payload.shift_duration, // Replace with calculated duration if needed
                employment_active: true,
                employment_start_date: parseDateString(payload.employment_start_date),
              }
            },
          }
        });
      }

      const code = await createFreeCode(async code => {
        return !(await prisma.userConfirmation.findFirst({ where: { confirm_email_code: code } }));
      });

      const userConfirmation = await prisma.userConfirmation.create({
        data: {
          user_id: user.id,
          confirm_email_code: code,
          confirm_email_code_sent: new Date()
        }
      });

      return [user, userConfirmation];
    });

    return [user, userConfirmation];
  }
}
