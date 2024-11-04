import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";
import { PrismaService } from "../../repositories/prisma.service";

type Payload = {
  id: string;
};

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }

  serializeUser(user: User, done: (err: unknown, user: User) => void): void {
    done(null, user);
  }

  async deserializeUser(payload: Payload, done: (err: unknown, user: User | null) => void): Promise<void> {
    const user = await this.prisma.user.findFirst({ where: { id: payload.id } });
    return user ? done(null, user) : done(null, null);
  }
}
