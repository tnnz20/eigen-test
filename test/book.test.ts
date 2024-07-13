import supertest from "supertest";
import { app } from "../src/applications/app";
import {
    ErrorResponseAPI,
    SuccessResponseAPI,
} from "../src/response/response_constant";
import { BookTest, BorrowTest, MemberTest, PenaltyTest } from "./test-util";

describe("POST /api/v1/books", () => {
    afterAll(async () => {
        await BookTest.delete();
    });

    it("should reject create new book if request is invalid", async () => {
        const response = await supertest(app).post("/api/v1/books").send({
            code: "",
            title: "",
            author: "",
            stock: 0,
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.BadRequest);
    });

    it("should create new book", async () => {
        const response = await supertest(app).post("/api/v1/books").send({
            code: "B-001",
            title: "Book Title",
            author: "Book Author",
            stock: 1,
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toEqual(SuccessResponseAPI.Created);
    });
});

describe("GET /api/v1/books", () => {
    beforeAll(async () => {
        await BookTest.createMany();
    });

    afterAll(async () => {
        await BookTest.deleteAll();
    });

    it("should get all books", async () => {
        const response = await supertest(app).get("/api/v1/books");

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.paging).toBeDefined();
    });

    it("should get all books with query", async () => {
        const response = await supertest(app).get(
            "/api/v1/books?title=Book Title"
        );

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.paging).toBeDefined();
    });
});

describe("POST /api/v1/books/borrow", () => {
    beforeAll(async () => {
        await MemberTest.create();
        await BookTest.createMany();
    });

    afterAll(async () => {
        await BorrowTest.deleteAll();
        await MemberTest.deleteAll();
        await BookTest.deleteAll();
        await PenaltyTest.deleteAll();
    });

    it("should reject borrow book if request is invalid", async () => {
        const response = await supertest(app)
            .post("/api/v1/books/borrow")
            .send({
                memberCode: "",
                bookCode: "",
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.BadRequest);
    });

    it("should reject borrow book if book is not found", async () => {
        const response = await supertest(app)
            .post("/api/v1/books/borrow")
            .send({
                memberCode: "T-001",
                bookCode: "B-002",
            });

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.NotFound);
    });

    it("should reject borrow book if member has penalty", async () => {
        await PenaltyTest.createPenaltyMember();

        const response = await supertest(app)
            .post("/api/v1/books/borrow")
            .send({
                memberCode: "T-011",
                bookCode: "B-001",
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toEqual("Member has penalty");
        expect(response.body.message).toEqual(ErrorResponseAPI.BadRequest);
    });

    it("should borrow book", async () => {
        const response = await supertest(app)
            .post("/api/v1/books/borrow")
            .send({
                memberCode: "T-001",
                bookCode: "B-001",
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toEqual(SuccessResponseAPI.Created);
    });

    it("should reject borrow book if reach maximum borrow", async () => {
        // borrow book again
        await supertest(app).post("/api/v1/books/borrow").send({
            memberCode: "T-001",
            bookCode: "B-003",
        });

        const response = await supertest(app)
            .post("/api/v1/books/borrow")
            .send({
                memberCode: "T-001",
                bookCode: "B-004",
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.BadRequest);
    });
});

describe("POST /api/v1/books/return", () => {
    beforeAll(async () => {
        await MemberTest.create("8");
        await BookTest.createMany();
    });

    afterAll(async () => {
        await BorrowTest.deleteAll();
        await MemberTest.deleteAll();
        await BookTest.deleteAll();
        await PenaltyTest.deleteAll();
    });

    it("should reject return book if request is invalid", async () => {
        const response = await supertest(app)
            .post("/api/v1/books/return")
            .send({
                memberCode: "",
                bookCode: "",
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.BadRequest);
    });

    it("should reject return book if book is not found", async () => {
        const response = await supertest(app)
            .post("/api/v1/books/return")
            .send({
                memberCode: "T-001",
                bookCode: "B-002",
            });
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.NotFound);
    });

    it("should reject return book if not borrowed", async () => {
        const response = await supertest(app)
            .post("/api/v1/books/return")
            .send({
                memberCode: "T-001",
                bookCode: "B-001",
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toEqual("Book is not borrowed by member");
        expect(response.body.message).toEqual(ErrorResponseAPI.BadRequest);
    });

    it("should return book", async () => {
        await BorrowTest.create();

        const response = await supertest(app)
            .post("/api/v1/books/return")
            .send({
                memberCode: "T-004",
                bookCode: "B-006",
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual("Book returned successfully");
    });

    it("should return book overdue", async () => {
        await PenaltyTest.createOverdueReturnBook();

        const response = await supertest(app)
            .post("/api/v1/books/return")
            .send({
                memberCode: "T-003",
                bookCode: "B-005",
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toEqual(
            "Book returned successfully, but overdue. Penalty applied."
        );
    });
});
