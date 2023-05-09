import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthSingInDto, AuthSingUpDto } from '../src/auth/dto';
import { UserEditDto } from '../src/user/dto/user.edit.dto';
import { BooksAddDto } from '../src/books/dto/books.add.dto';

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
          .stores('token', 'token');
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

    describe('Edit User', () => {
      it('should edit user', () => {
        const editBody: UserEditDto = {
          email: 'vadim@mail.ru',
        };

        return pactum
          .spec()
          .patch('/users/edit/')
          .withHeaders({
            Authorization: `Bearer $S{token}`,
          })
          .withBody(editBody)
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('Book', () => {
    describe('Get empty book list', () => {
      it('should get books', () => {
        return pactum
          .spec()
          .get('/books')
          .withHeaders({
            Authorization: `Bearer $S{token}`,
          })
          .expectStatus(HttpStatus.OK)
          .expectBody([]);
      });
    });

    describe('Add book', () => {
      const userBook: BooksAddDto = {
        title: 'Example advantures',
        subtitle: 'Great',
        description: 'Description',
        link: 'https://example.com',
      };

      it('should add book', () => {
        return pactum
          .spec()
          .post('/books/add')
          .withHeaders({
            Authorization: `Bearer $S{token}`,
          })
          .withBody(userBook)
          .expectStatus(HttpStatus.CREATED)
          .stores('booksId', 'id');
      });
    });

    describe('Get books', () => {
      it('should get books', () => {
        return pactum
          .spec()
          .get('/books')
          .withHeaders({
            Authorization: `Bearer $S{token}`,
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1);
      });
    });

    describe('Get Book by ID', () => {
      it('should get book by ID', () => {
        return pactum
          .spec()
          .get('/books/{id}')
          .withPathParams('id', '$S{bookId}')
          .withHeaders({
            Authorization: `Bearer $S{token}`,
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookId}');
      });
    });

    describe('Delete book', () => {
      it('should delete book by ID', () => {
        return pactum
          .spec()
          .delete('/books/{id}')
          .withPathParams('id', '$S{bookId}')
          .withHeaders({
            Authorization: `Bearer $S{token}`,
          })
          .expectStatus(HttpStatus.OK);
      });

      it('should get empty book list', () => {
        return pactum
          .spec()
          .get('/books')
          .withHeaders({
            Authorization: `Bearer $S{token}`,
          })
          .expectStatus(HttpStatus.OK)
          .expectBody([]);
      });
    });
  });
});
