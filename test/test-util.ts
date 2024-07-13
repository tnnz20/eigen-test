import { prismaClient } from "../src/applications/database";
export class MemberTest {
    static async delete() {
        await prismaClient.member.delete({
            where: {
                code: "T-001",
            },
        });
    }

    static async create(code: string = "1") {
        await prismaClient.member.create({
            data: {
                code: `T-00${code}`,
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
}

export class BorrowTest {
    static async deleteAll() {
        await prismaClient.borrow.deleteMany();
    }

    static async create() {
        const currentDate = new Date().getTime();
        const member = await prismaClient.member.create({
            data: {
                code: "T-004",
                name: "John Doer",
                created_at: currentDate,
                updated_at: currentDate,
            },
        });

        const book = await prismaClient.book.create({
            data: {
                code: "B-006",
                title: "Book Title 6",
                author: "Book Author 6",
                stock: 1,
                created_at: currentDate,
                updated_at: currentDate,
            },
        });

        await prismaClient.borrow.create({
            data: {
                member_id: member.id,
                book_id: book.id,
                borrow_date: currentDate,
                status: 0,
            },
        });
    }
}

export class PenaltyTest {
    static async createPenaltyMember() {
        const member = await prismaClient.member.create({
            data: {
                code: "T-011",
                name: "John Wik",
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
            },
        });

        const currentDate = new Date().getTime();
        await prismaClient.penalty.create({
            data: {
                member_id: member.id,
                start_date: currentDate,
                end_date: currentDate + 3 * 24 * 60 * 60 * 1000,
            },
        });
    }

    static async deleteAll() {
        await prismaClient.penalty.deleteMany();
    }

    static async createOverdueReturnBook() {
        const currentDate = new Date().getTime();
        const member = await prismaClient.member.create({
            data: {
                code: "T-003",
                name: "John Wik",
                created_at: currentDate,
                updated_at: currentDate,
            },
        });

        const book = await prismaClient.book.create({
            data: {
                code: "B-005",
                title: "Book Title 5",
                author: "Book Author 5",
                stock: 1,
                created_at: currentDate,
                updated_at: currentDate,
            },
        });

        await prismaClient.borrow.create({
            data: {
                member_id: member.id,
                book_id: book.id,
                borrow_date: currentDate - 9 * 24 * 60 * 60 * 1000,
                status: 0,
            },
        });
    }
}
