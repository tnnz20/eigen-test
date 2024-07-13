import { Prisma } from "@prisma/client";
import { prismaClient } from "../../applications/database";
import { ResponseError } from "../../error/response-error";
import { BookValidation } from "../../validation/book-validation";
import { Validation } from "../../validation/validation";
import { Pageable } from "../paging/page";
import {
    BookResponse,
    BorrowBookRequest,
    CreateBookRequest,
    GetBooksRequest,
    toBookResponse,
} from "./book";

export class BookService {
    static async create(request: CreateBookRequest) {
        const createRequest = Validation.validate(
            BookValidation.CREATE,
            request
        );

        const totalBookWithSameCode = await prismaClient.book.count({
            where: {
                code: createRequest.code,
            },
        });

        if (totalBookWithSameCode > 0) {
            throw new ResponseError(400, "Book with same code already exists");
        }

        const unixDate = new Date().getTime();

        return await prismaClient.book.create({
            data: {
                code: createRequest.code,
                title: createRequest.title,
                author: createRequest.author,
                stock: createRequest.stock,
                created_at: unixDate,
                updated_at: unixDate,
            },
        });
    }

    static async getBooks(
        request: GetBooksRequest
    ): Promise<Pageable<BookResponse>> {
        const getBooksRequest = Validation.validate(
            BookValidation.GET_BOOKS,
            request
        );

        const filters = [];

        if (getBooksRequest.code) {
            filters.push({
                code: {
                    contains: getBooksRequest.code,
                    mode: "insensitive" as Prisma.QueryMode,
                },
            });
        }

        if (getBooksRequest.title) {
            filters.push({
                title: {
                    contains: getBooksRequest.title,
                    mode: "insensitive" as Prisma.QueryMode,
                },
            });
        }

        if (getBooksRequest.author) {
            filters.push({
                author: {
                    contains: getBooksRequest.author,
                    mode: "insensitive" as Prisma.QueryMode,
                },
            });
        }

        if (getBooksRequest.stock) {
            filters.push({
                stock: getBooksRequest.stock,
            });
        }

        const skip = (getBooksRequest.page - 1) * getBooksRequest.size;
        const total = await prismaClient.book.count({
            where: {
                is_borrowed: false,
                AND: filters,
            },
        });

        const books = await prismaClient.book.findMany({
            where: {
                is_borrowed: false,
                AND: filters,
            },
            take: getBooksRequest.size,
            skip: skip,
        });

        if (books.length === 0) {
            throw new ResponseError(404, "No books found");
        }
        return {
            data: books.map((book) => {
                return toBookResponse(book);
            }),
            paging: {
                current_page: getBooksRequest.page,
                total_page: Math.ceil(total / getBooksRequest.size),
                size: getBooksRequest.size,
            },
        };
    }

    static async checkBookMustExist(code?: string, title?: string) {
        if (code) {
            const book = await prismaClient.book.findFirst({
                where: {
                    code: code,
                },
            });
            if (!book) {
                throw new ResponseError(404, "Book not found");
            }
            return toBookResponse(book);
        }

        if (title) {
            const book = await prismaClient.book.findFirst({
                where: {
                    title: title,
                },
            });
            if (!book) {
                throw new ResponseError(404, "Book not found");
            }
            return toBookResponse(book);
        }
    }

    static async BorrowBook(request: BorrowBookRequest) {
        const borrowRequest = Validation.validate(
            BookValidation.BORROW_BOOK,
            request
        );

        const member = await prismaClient.member.findFirst({
            where: {
                code: borrowRequest.memberCode,
            },
        });

        if (!member) {
            throw new ResponseError(404, "Member not found");
        }

        const bookRequest = borrowRequest.bookCode
            ? borrowRequest.bookCode
            : borrowRequest.title;

        const book = await this.checkBookMustExist(bookRequest);

        if (book?.is_borrowed) {
            throw new ResponseError(400, "Book is already borrowed");
        }

        const unixDate = new Date().getTime();

        await prismaClient.$transaction(async (tx) => {
            // Lock the book row for update
            const lockedBook = await tx.$queryRaw<
                BookResponse[]
            >`SELECT * FROM "books" WHERE id = ${book?.id} FOR UPDATE`;

            const bookData = lockedBook[0]; // Access the first element of the array

            // Update the book stock and borrow status
            await tx.book.update({
                where: { id: bookData.id },
                data: { stock: { decrement: 1 }, is_borrowed: true },
            });

            // Create a new borrow record
            await tx.borrow.create({
                data: {
                    member_id: member.id,
                    book_id: bookData.id,
                    borrow_date: unixDate,
                    status: 0,
                },
            });
        });
    }
}
