import supertest from "supertest";
import { app } from "../src/applications/app";
import {
    ErrorResponseAPI,
    SuccessResponseAPI,
} from "../src/response/response_constant";
import { MemberTest } from "./test-util";

describe("POST /api/v1/members", () => {
    afterAll(async () => {
        await MemberTest.delete();
    });

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

describe("GET /api/v1/members", () => {
    afterAll(async () => {
        await MemberTest.deleteAll();
    });

    it("should reject get all members if no member found", async () => {
        const response = await supertest(app).get("/api/v1/members");

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.NotFound);
    });

    it("should get all members", async () => {
        await MemberTest.createMany();

        const response = await supertest(app).get("/api/v1/members");

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.paging).toBeDefined();
        expect(response.body.paging.total_page).toBeGreaterThan(0);
    });

    it("should get member by name", async () => {
        const response = await supertest(app).get("/api/v1/members?name=jan");

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.paging).toBeDefined();
        expect(response.body.paging.total_page).toBeGreaterThan(0);
    });

    it("should get member by code", async () => {
        const response = await supertest(app).get("/api/v1/members?code=T-001");

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.paging).toBeDefined();
        expect(response.body.paging.total_page).toBeGreaterThan(0);
    });
});

describe("GET /api/v1/members/:memberCode", () => {
    afterAll(async () => {
        await MemberTest.delete();
    });

    it("should reject get member by code if member not found", async () => {
        const response = await supertest(app).get("/api/v1/members/T-001");

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.message).toEqual(ErrorResponseAPI.NotFound);
    });

    it("should get member by memberCode", async () => {
        await MemberTest.create();

        const response = await supertest(app).get("/api/v1/members/T-001");

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.code).toEqual("T-001");
    });
});
