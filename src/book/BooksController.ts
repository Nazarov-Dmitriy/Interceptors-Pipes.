import {
  Controller,
  Get,
  Render,
  Post,
  Body,
  Redirect,
  Param,
  UseInterceptors,
  UsePipes,
  UseFilters,
} from '@nestjs/common';
import { BooksService } from './BooksService';
import CreateBookDto from '../dto/CreateBookDto';
import { BookDocument } from '../schemas/book.schema';
import { LogInterceptor } from 'src/app.log.interceptor';
import { AppIdValidationPipe } from '../app.id.validation.pipe';
import { AppBodyValidationPipe } from '../app.body.validation.pipe';
import { JoiValidationPipe } from '../validation/joi.validation.pipe';
import { createSchema } from '../validation/schemas/create.schema';
import { HttpExceptionFilter } from '../http.exception.filter';

@UseInterceptors(LogInterceptor)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Render('books/index')
  public async getBooks() {
    if (Math.random() > 0.75) {
      throw new Error('something wrong');
    }
    const books: BookDocument[] = await this.booksService.getBooks();

    return {
      title: 'Книги',
      books: books,
    };
  }

  @Get('/create')
  @Render('books/create')
  root() {
    return {
      title: 'Создать книгу',
      book: {},
    };
  }

  @UseFilters(HttpExceptionFilter)
  @UsePipes(new JoiValidationPipe(createSchema))
  @Post('/create')
  @Redirect('/books')
  createBook(@Body() CreateBookDto: CreateBookDto): Promise<BookDocument> {
    return this.booksService.createBook(CreateBookDto);
  }

  @Get(':id')
  @Render('books/view')
  async getBookId(@Param('id', AppIdValidationPipe) id: string) {
    const book = await this.booksService.getBookId(id);

    if (book === null) {
      Redirect('/404');
    }
    return {
      title: 'Книга ',
      book: book,
    };
  }

  @Get('/update/:id')
  @Render('books/update')
  async updateForm(@Param('id', AppIdValidationPipe) id: string) {
    const book = await this.booksService.getBookId(id);
    if (book === null) {
      Redirect('/404');
    }
    return {
      title: 'Редактировать книгу',
      book: book,
    };
  }

  @UsePipes(AppBodyValidationPipe)
  @Post('/update/:id')
  @Redirect('/books')
  update(
    @Param('id', AppIdValidationPipe) id: string,
    @Body() CreateBookDto: CreateBookDto,
  ) {
    const book = this.booksService.update(id, CreateBookDto);
    if (book === null) {
      Redirect('/404');
    }
  }

  @Post('/remove/:id')
  @Redirect('/books')
  delete(@Param('id', AppIdValidationPipe) id: string) {
    const book = this.booksService.delete(id);
    if (book === null) {
      Redirect('/404');
    }
  }
}
