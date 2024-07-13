import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import {
    ErrorBadRequest,
    ErrorInternalServerError,
    ErrorNotFound,
} from "../response/response";

function customizeZodError(error: ZodError) {
    const customErrors = error.errors.map((err) => {
        const path = err.path.join(".");
        return `field ${path}: ${err.message}`;
    });

    return customErrors[0];
}

export async function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof ZodError) {
        const customizeError = `Validation Error: ${customizeZodError(error)}`;
        ErrorBadRequest(res, customizeError);
    } else if (error instanceof ResponseError) {
        if (error.code === 400) {
            ErrorBadRequest(res, error.message);
        } else if (error.code === 404) {
            ErrorNotFound(res, error.message);
        }
    } else {
        ErrorInternalServerError(res, error.message);
    }
}
