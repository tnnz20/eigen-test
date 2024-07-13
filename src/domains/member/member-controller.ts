import { NextFunction, Request, Response } from "express";
import { CreateMemberRequest } from "./member";
import { MemberService } from "./member-service";
import { SuccessCreated, SuccessOk } from "../../response/response";

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

    static async getMemberByCode(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const code = req.params.memberCode;

            const member = await MemberService.getMemberByCode(code);

            SuccessOk(res, member);
        } catch (error) {
            next(error);
        }
    }

    static async getMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const members = await MemberService.getMembers();

            SuccessOk(res, members);
        } catch (error) {
            next(error);
        }
    }
}
