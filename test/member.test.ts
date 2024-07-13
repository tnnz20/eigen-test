import supertest from "supertest";
import { app } from "../src/applications/app";
import {
    ErrorResponseAPI,
    SuccessResponseAPI,
} from "../src/response/response_constant";

describe("POST /api/v1/members", () => {
    it("should reject register new member if request is invalid", async () => {
        const response = await supertest(app).post("/api/v1/members").send({
            code: "",
            name: "",
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.BadRequest);
    });

    it("should register new member", async () => {
        const response = await supertest(app).post("/api/v1/members").send({
            code: "T-001",
            name: "John Doe",
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toEqual(SuccessResponseAPI.Created);
    });

    it("should reject register new member if member with same code already exists", async () => {
        const response = await supertest(app).post("/api/v1/members").send({
            code: "T-001",
            name: "John Doe 2",
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.BadRequest);
    });
});
