import { prismaClient } from "../../applications/database";
import { ResponseError } from "../../error/response-error";
import { MemberValidation } from "../../validation/member-validation";
import { Validation } from "../../validation/validation";
import { CreateMemberRequest } from "./member";

export class MemberService {
    static async create(request: CreateMemberRequest) {
        const createRequest = Validation.validate(
            MemberValidation.CREATE,
            request
        );

        const totalMemberWithSameCode = await prismaClient.member.count({
            where: {
                code: createRequest.code,
            },
        });

        if (totalMemberWithSameCode > 0) {
            throw new ResponseError(
                400,
                "Member with same code already exists"
            );
        }

        const unixDate = new Date().getTime();

        return await prismaClient.member.create({
            data: {
                code: createRequest.code,
                name: createRequest.name,
                created_at: unixDate,
                updated_at: unixDate,
            },
        });
    }
}
