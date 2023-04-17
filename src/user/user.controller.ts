import {Controller, Get, Request, UseGuards, Patch} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@Request() req) {
    // console.log({ req: req.user });
    return req.user;
  }

  @Patch()
  updateUser() {

  }
}
