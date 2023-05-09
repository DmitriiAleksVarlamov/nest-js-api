import { Delete, Get, Injectable } from '@nestjs/common';
import {BooksAddDto} from "./dto/books.add.dto";

@Injectable()
export class BooksService {
  addBook(id: number, book: BooksAddDto) {}

  getBooks(id: number) {

  }

  getBookById(userId: number, bookId: number) {}

  removeBook(userId: number, bookId: number) {}
}
