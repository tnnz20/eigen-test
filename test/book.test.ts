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
