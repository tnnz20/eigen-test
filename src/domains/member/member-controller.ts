import { NextFunction, Request, Response } from "express";
import { CreateMemberRequest } from "./member";
import { MemberService } from "./member-service";
import { SuccessCreated } from "../../response/response";

export class MemberController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateMemberRequest =
                req.body as CreateMemberRequest;

            await MemberService.create(request);

            SuccessCreated(res);
        } catch (error) {
            next(error);
        }
    }
}
