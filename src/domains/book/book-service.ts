import { prismaClient } from "../../applications/database";
import { ResponseError } from "../../error/response-error";
import { BookValidation } from "../../validation/book-validation";
import { Validation } from "../../validation/validation";
import { Pageable } from "../paging/page";
import { CreateBookRequest } from "./book";

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
}
