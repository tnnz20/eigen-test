import { Member, Prisma } from "@prisma/client";

import { prismaClient } from "../../applications/database";
import { ResponseError } from "../../error/response-error";
import { MemberValidation } from "../../validation/member-validation";
import { Validation } from "../../validation/validation";
import { Pageable } from "../paging/page";
import {
    CreateMemberRequest,
    GetMembersRequest,
    MemberResponse,
} from "./member";

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

    static async checkMemberMustExist(code: string) {
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

    static async getMemberByCode(code: string): Promise<MemberResponse> {
        const member = await this.checkMemberMustExist(code);
        return member;
    }

    static async getMembers(
        request: GetMembersRequest
    ): Promise<Pageable<MemberResponse>> {
        const getMembersRequest = Validation.validate(
            MemberValidation.GET_MEMBERS,
            request
        );

        const skip = (getMembersRequest.page - 1) * getMembersRequest.size;
        const filters = [];

        if (getMembersRequest.code) {
            filters.push({
                code: {
                    contains: getMembersRequest.code,
                    mode: "insensitive" as Prisma.QueryMode,
                },
            });
        }

        if (getMembersRequest.name) {
            filters.push({
                name: {
                    contains: getMembersRequest.name,
                    mode: "insensitive" as Prisma.QueryMode,
                },
            });
        }

        const members = await prismaClient.member.findMany({
            where: {
                AND: filters,
            },
            take: getMembersRequest.size,
            skip: skip,
        });

        const total = await prismaClient.member.count({
            where: {
                AND: filters,
            },
        });

        if (members.length === 0) {
            throw new ResponseError(404, "No member found");
        }

        const getMembersWithBorrowCounts = async (members: Member[]) => {
            const getMemberData = async (member: Member) => {
                const totalBorrowBook = await prismaClient.borrow.count({
                    where: {
                        member_id: member.id,
                        status: 0,
                    },
                });

                return {
                    id: member.id,
                    code: member.code,
                    name: member.name,
                    total_borrow_book: totalBorrowBook,
                    created_at: Number(member.created_at),
                    updated_at: Number(member.updated_at),
                };
            };

            return Promise.all(members.map(getMemberData));
        };

        // Usage:
        const membersWithBorrowCounts = await getMembersWithBorrowCounts(
            members
        );

        return {
            data: membersWithBorrowCounts,
            paging: {
                current_page: getMembersRequest.page,
                total_page: Math.ceil(total / getMembersRequest.size),
                size: request.size,
            },
        };
    }
}
