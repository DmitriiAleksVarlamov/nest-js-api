import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSingInDto, AuthSingUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sing-up')
  singUp(@Body() authSingUpDto: AuthSingUpDto) {
    return this.authService.singUp(authSingUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() authSingInDto: AuthSingInDto) {
    return this.authService.signIn(authSingInDto);
  }
}
