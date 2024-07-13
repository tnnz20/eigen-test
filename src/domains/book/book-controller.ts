import { NextFunction, Request, Response } from "express";
import { SuccessCreated } from "../../response/response";
import { CreateBookRequest } from "./book";
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
}
