import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BooksModule } from './books/books.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BooksModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
