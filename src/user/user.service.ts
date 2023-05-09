import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEditDto } from './dto/user.edit.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, userData: UserEditDto) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...userData,
      },
    });

    delete updatedUser.hash;

    return updatedUser;
  }
}
