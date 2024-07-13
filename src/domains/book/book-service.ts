import { Prisma } from "@prisma/client";
import { prismaClient } from "../../applications/database";
import { ResponseError } from "../../error/response-error";
import { BookValidation } from "../../validation/book-validation";
import { Validation } from "../../validation/validation";
import { Pageable } from "../paging/page";
import { BookResponse, CreateBookRequest, GetBooksRequest } from "./book";

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
            }),
            paging: {
                current_page: getBooksRequest.page,
                total_page: Math.ceil(total / getBooksRequest.size),
                size: getBooksRequest.size,
            },
        };
    }
}
