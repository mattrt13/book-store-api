import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
import { BookDTO } from './book.dto';
import { promises } from 'dns';

@Injectable()
export class BookService {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) { }

    async findAll(): Promise<BookDTO[]> {
        const books = await this.bookRepository.find();
        return books.map(book => this.toDTO(book));
    }

    async findByName(bookName: string): Promise<BookDTO> {
        const book = await this.bookRepository.findOneBy({ name: bookName });
        return this.toDTO(book);
    }

    async findByAuthor(author: string): Promise<BookDTO[]> {
        const books = await this.bookRepository.findBy({ author });
        return books.map(book => this.toDTO(book));
    }

    async createBook(bookData: BookDTO): Promise<Book> {
        var available = await this.bookRepository.find({
            where: [
                { name: bookData.name, author: bookData.author }
            ]
        });

        if (available.length > 0) {
            return available[0];
        }

        let result = this.bookRepository.create({
            name: bookData.name,
            author: bookData.author,
            price: bookData.price
        });
        return this.bookRepository.save(result);
    }

    async updateBook(id: number, newBookData: Partial<BookDTO>): Promise<Book> {
        const currentBook = await this.bookRepository.findOneBy({ id });

        if (!currentBook)
            throw new Error(`Book with ID ${id} not found`);

        const updatedBook = this.updateBookData(currentBook, newBookData);
        return this.bookRepository.save(updatedBook);
    }

    async deleteBook(id: number): Promise<void> {
        await this.bookRepository.delete({ id })
    }


    private updateBookData(book: Book, BookData: Partial<BookDTO>): Book {
        book.name = BookData.name;
        book.author = BookData.author;
        book.price = BookData.price;
        return book;
    }

    private toDTO(book: Book): BookDTO {
        return {
            name: book.name,
            author: book.author,
            price: book.price
        };
    }

}
