import { Response } from "express";
import { ErrorResponseAPI, SuccessResponseAPI } from "./response_constant";

export function SuccessCreated(res: Response) {
    res.status(201).json({
        message: SuccessResponseAPI.Created,
        code: 201,
    });
}

export function SuccessOk(res: Response, data: any) {
    res.status(200).json({
        message: SuccessResponseAPI.Ok,
        code: 200,
        data,
    });
}

export function ErrorBadRequest(res: Response, errors: any) {
    res.status(400).json({
        code: 400,
        message: ErrorResponseAPI.BadRequest,
        errors,
    });
}

export function ErrorNotFound(res: Response, errors: any) {
    res.status(404).json({
        code: 404,
        message: ErrorResponseAPI.NotFound,
        errors,
    });
}

export function ErrorInternalServerError(res: Response, errors: any) {
    res.status(500).json({
        code: 500,
        message: ErrorResponseAPI.InternalServerError,
        errors,
    });
}
