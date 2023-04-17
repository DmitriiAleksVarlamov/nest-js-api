import {
  Controller,
  Get,
  Request,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEditDto } from './dto/user.edit.dto';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorators/auth.getUser.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@Request() req) {
    // console.log({ req: req.user });
    return req.user;
  }

  @Patch('edit')
  updateUser(@GetUser('id') userId: number, @Body() user: UserEditDto) {
    // const { id, ...otherUserParams } = user;
    return this.userService.editUser(userId, user);
  }
}
