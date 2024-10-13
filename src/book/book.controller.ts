import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDTO } from './book.dto';

@Controller('api/book')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Get()
    findAll(): Promise<BookDTO[]> {
        return this.bookService.findAll()
    }

    @Get('name/:name')
    findByName(@Param('name') name: string): Promise<BookDTO> {
        return this.bookService.findByName(name);
    }

    @Get('author/:author')
    findByAuthor(@Param('author') author: string): Promise<BookDTO[]> {
        return this.bookService.findByAuthor(author);
    }

    @Post()
    @HttpCode(201)
    createBook(@Body() bookdata: BookDTO): Promise<BookDTO> {
        return this.bookService.createBook(bookdata);
    }

    @Put('/:id')
    updateBook(@Param('id') id: number, @Body() book: Partial<BookDTO>): Promise<BookDTO> {
        return this.bookService.updateBook(id, book);
    }

    @Delete('/:id')
    deleteBook(@Param('id') id: number): Promise<void> {
        return this.bookService.deleteBook(id);
    }
}
