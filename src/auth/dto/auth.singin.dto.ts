import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthSingInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
