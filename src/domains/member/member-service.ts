import { prismaClient } from "../../applications/database";
import { ResponseError } from "../../error/response-error";
import { MemberValidation } from "../../validation/member-validation";
import { Validation } from "../../validation/validation";
import { CreateMemberRequest, MemberResponse } from "./member";

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

    static async getMemberByCode(code: string): Promise<MemberResponse> {
        const member = await prismaClient.member.findFirst({
            where: {
                code: code,
            },
        });

        if (!member) {
            throw new ResponseError(404, "Member not found");
        }

        const response: MemberResponse = {
            id: member.id,
            code: member.code,
            name: member.name,
            created_at: Number(member.created_at),
            updated_at: Number(member.updated_at),
        };
        return response;
    }

    static async getMembers(): Promise<MemberResponse[]> {
        const members = await prismaClient.member.findMany();

        if (members.length === 0) {
            throw new ResponseError(404, "Members not found");
        }

        return members.map((member) => ({
            id: member.id,
            code: member.code,
            name: member.name,
            created_at: Number(member.created_at),
            updated_at: Number(member.updated_at),
        }));
    }
}
