import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BooksService } from './books.service';
import { GetUser } from '../auth/decorators/auth.getUser.decorator';
import { BooksAddDto } from './dto/books.add.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  getBooks(@GetUser('id') userId: number) {
    return this.booksService.getBooks(userId);
  }

  @Post('add')
  addBook(@GetUser('id') userId: number, bookInfo: BooksAddDto) {
    return this.booksService.addBook(userId, bookInfo);
  }

  @Get(':id')
  getBookById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.booksService.getBookById(userId, bookId);
  }

  @Delete(':id')
  removeBook(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.booksService.removeBook(userId, bookId);
  }
}
