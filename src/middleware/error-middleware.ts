import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorResponseAPI } from "../constants/constants";
import { ResponseError } from "../error/response-error";

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
        res.status(400).json({
            errors: `Validation Error: ${customizeZodError(error)}`,
            message: ErrorResponseAPI.BadRequest,
            code: 400,
        });
    } else if (error instanceof ResponseError) {
        res.status(error.code).json({
            errors: error.message,
            message: ErrorResponseAPI.BadRequest,
            code: 400,
        });
    } else {
        res.status(500).json({
            errors: error.message,
            message: ErrorResponseAPI.InternalServerError,
            code: 500,
        });
    }
}
