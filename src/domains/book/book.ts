import { Book } from "@prisma/client";

export type BookResponse = {
    id: number;
    code: string;
    title: string;
    author: string;
    stock: number;
    is_borrowed: boolean;
    created_at: number;
    updated_at: number;
};

export type CreateBookRequest = {
    code: string;
    title: string;
    author: string;
    stock: number;
};

export type GetBooksRequest = {
    code?: string;
    title?: string;
    author?: string;
    stock?: number;
    page: number;
    size: number;
};

export type BorrowBookRequest = {
    memberCode: string;
    bookCode?: string;
    title?: string;
};

export function toBookResponse(book: Book): BookResponse {
    return {
        id: book.id,
        code: book.code,
        title: book.title,
        author: book.author,
        stock: book.stock,
        is_borrowed: book.is_borrowed,
        created_at: Number(book.created_at),
        updated_at: Number(book.updated_at),
    };
}
