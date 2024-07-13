import { NextFunction, Request, Response } from "express";
import { CreateMemberRequest, GetMembersRequest } from "./member";
import { MemberService } from "./member-service";
import {
    SuccessCreated,
    SuccessOk,
    SuccessOkWithPagination,
} from "../../response/response";

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
            const request: GetMembersRequest = {
                code: req.query.code as string,
                name: req.query.name as string,
                page: req.query.page ? Number(req.query.page) : 1,
                size: req.query.size ? Number(req.query.size) : 5,
            };

            const members = await MemberService.getMembers(request);

            SuccessOkWithPagination(res, members.data, members.paging);
        } catch (error) {
            next(error);
        }
    }
}
