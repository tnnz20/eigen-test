import { NextFunction, Request, Response } from "express";
import {
    SuccessCreated,
    SuccessOkWithPagination,
} from "../../response/response";
import { CreateBookRequest, GetBooksRequest } from "./book";
import { BookService } from "./book-service";

export class BookController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateBookRequest = req.body;

            await BookService.create(request);

            SuccessCreated(res);
        } catch (error) {
            next(error);
        }
    }

    static async getBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const request: GetBooksRequest = {
                code: req.query.code as string,
                title: req.query.title as string,
                author: req.query.author as string,
                stock: req.query.stock ? Number(req.query.stock) : undefined,
                page: req.query.page ? Number(req.query.page) : 1,
                size: req.query.size ? Number(req.query.size) : 5,
            };

            const books = await BookService.getBooks(request);

            SuccessOkWithPagination(res, books.data, books.paging);
        } catch (error) {
            next(error);
        }
    }

    static async borrowBook(req: Request, res: Response, next: NextFunction) {
        try {
            const memberCode = req.body.memberCode;
            const bookCode = req.body.bookCode;
            const title = req.body.title;

            await BookService.BorrowBook({
                memberCode,
                bookCode,
                title,
            });

            SuccessCreated(res);
        } catch (error) {
            next(error);
        }
    }
}
