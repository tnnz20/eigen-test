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

    static async createMany() {
        await prismaClient.member.createMany({
            data: [
                {
                    code: "T-001",
                    name: "Jane Doe",
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                },
                {
                    code: "T-002",
                    name: "John Smith",
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                },
            ],
        });
    }

    static async deleteAll() {
        await prismaClient.member.deleteMany();
    }
}

export class BookTest {
    static async delete() {
        await prismaClient.book.delete({
            where: {
                code: "B-001",
            },
        });
    }

    static async create() {
        await prismaClient.book.create({
            data: {
                code: "B-001",
                title: "Book Title",
                author: "Book Author",
                stock: 1,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
            },
        });
    }

    static async createMany() {
        await prismaClient.book.createMany({
            data: [
                {
                    code: "B-001",
                    title: "Book Title",
                    author: "Book Author",
                    stock: 1,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                },
                {
                    code: "B-002",
                    title: "Book Title 2",
                    author: "Book Author 2",
                    stock: 0,
                    is_borrowed: true,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                },
                {
                    code: "B-003",
                    title: "Book Title 3",
                    author: "Book Author 3",
                    stock: 1,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                },
                {
                    code: "B-004",
                    title: "Book Title 4",
                    author: "Book Author 4",
                    stock: 1,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                },
            ],
        });
    }

    static async deleteAll() {
        await prismaClient.book.deleteMany();
    }

    static async deleteAllBorrow() {
        await prismaClient.borrow.deleteMany();
    }
}
