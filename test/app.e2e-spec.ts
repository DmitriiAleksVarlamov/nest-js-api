import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthSingInDto, AuthSingUpDto } from '../src/auth/dto';

describe('AppController E2E', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    const prisma = app.get(PrismaService);

    await prisma.clean();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    describe('SignUp', () => {
      it('Should sign up', () => {
        const signUpBody: AuthSingUpDto = {
          email: 'example@gmail.com',
          password: '123',
          firstName: 'Mark',
          lastName: 'Antoni',
        };
        return pactum
          .spec()
          .post('/auth/sing-up')
          .withBody(signUpBody)
          .expectStatus(HttpStatus.CREATED);
      });

      it('Should throw if email empty', () => {
        const signUpBody: AuthSingUpDto = {
          email: '',
          password: '123',
          firstName: 'Mark',
          lastName: 'Antoni',
        };
        return pactum
          .spec()
          .post('/auth/sing-up')
          .withBody(signUpBody)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('Should throw if password empty', () => {
        const signUpBody: AuthSingUpDto = {
          email: 'example@gmail.com',
          password: '',
          firstName: 'Mark',
          lastName: 'Antoni',
        };
        return pactum
          .spec()
          .post('/auth/sing-up')
          .withBody(signUpBody)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });

    describe('SignIn', () => {
      it('Should sign in', () => {
        const signInBody: AuthSingInDto = {
          email: 'example@gmail.com',
          password: '123',
        };

        return pactum
          .spec()
          .post('/auth/sign-in/')
          .withBody(signInBody)
          .expectStatus(HttpStatus.OK)
          .stores('token', 'token')
      });

      it('Should throw if email empty', () => {
        const signInBody: AuthSingInDto = {
          email: '',
          password: '123',
        };
        return pactum
          .spec()
          .post('/auth/sign-in/')
          .withBody(signInBody)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('Should throw if password empty', () => {
        const signInBody: AuthSingInDto = {
          email: '',
          password: '123',
        };
        return pactum
          .spec()
          .post('/auth/sign-in/')
          .withBody(signInBody)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('User', () => {
    describe('Get User', () => {
      it('should return current user', () => {
        return pactum
          .spec()
          .get('/users/me/')
          .withHeaders({
            Authorization: `Bearer $S{token}`,
          })
          .expectStatus(HttpStatus.OK);
      });
    });
    describe('Edit User', () => {});
  });
  describe('Book', () => {
    describe('Add book', () => {});
    describe('Get books', () => {});
    describe('Get Book by ID', () => {});
    describe('Delete book', () => {});
  });
});
