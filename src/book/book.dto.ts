export class BookDTO {
    name: string;
    author: string;
    price: number;
}

export class CreateBookCommand {
    name: string;
    author: string;
    price: number;
}

export class DeleteBookCommand {
    id: number;
    name: string;
}