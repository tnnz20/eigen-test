import supertest from "supertest";
import { app } from "../src/applications/app";
import {
    ErrorResponseAPI,
    SuccessResponseAPI,
} from "../src/response/response_constant";
import { BookTest } from "./test-util";

describe("POST /api/v1/books", () => {
    afterAll(async () => {
        await BookTest.delete();
    });

    it("should reject register new book if request is invalid", async () => {
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

        console.log(response.body.data);

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
