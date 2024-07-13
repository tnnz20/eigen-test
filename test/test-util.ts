import { prismaClient } from "../src/applications/database";
export class MemberTest {
    static async delete() {
        await prismaClient.member.delete({
            where: {
                code: "T-001",
            },
        });
    }

    static async create() {
        await prismaClient.member.create({
            data: {
                code: "T-001",
                name: "John Doe",
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
            },
        });
    }
}
