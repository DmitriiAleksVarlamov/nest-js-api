import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSingInDto, AuthSingUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const BCRYPT_HASH_LENGTH = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(data: AuthSingInDto) {
    try {
      // Find a user
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: data.email,
        },
      });

      // if exist compare passwords
      const isCompared = await bcrypt.compare(data.password, user.hash);

      // return user
      if (isCompared) {
        return this.signToken(user.id, user.email);
      }

      // if password is incorrect throw exception
      throw { status: HttpStatus.FORBIDDEN };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('No user found');
        }
      }
      if (error.status === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('Password is incorrect');
      }

      throw error;
    }
  }

  async singUp(data: AuthSingUpDto) {
    try {
      // create password hash
      const hash = await bcrypt.hash(data.password, BCRYPT_HASH_LENGTH);

      // create new user
      const newUser = await this.prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          hash,
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          id: true,
        },
      });

      return newUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential is taken');
        }
      }

      throw error;
    }
  }

  async signToken(userId: number, email: string): Promise<{ token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { token };
  }
}
