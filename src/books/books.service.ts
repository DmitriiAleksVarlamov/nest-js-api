import { ForbiddenException, Injectable } from '@nestjs/common';
import { BooksAddDto } from './dto/books.add.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks(userId: number) {
    return await this.prisma.book.findMany({
      where: {
        userId,
      },
    });
  }

  async addBook(userId: number, book: BooksAddDto) {
    const createdBook = await this.prisma.book.create({
      data: {
        userId,
        ...book,
      },
    });

    return createdBook;
  }

  async getBookById(userId: number, bookId: number) {
    return await this.prisma.book.findFirst({
      where: {
        id: bookId,
        userId,
      },
    });
  }

  async removeBook(userId: number, bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book || book.userId !== userId) {
      throw new ForbiddenException('Access is denied');
    }

    await this.prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    return { success: true };
  }
}
