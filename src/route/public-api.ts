import express from "express";
import { MemberController } from "../domains/member/member-controller";

export const publicRouter = express.Router();
publicRouter.post("/api/v1/members", MemberController.create);
publicRouter.get("/api/v1/members", MemberController.getMembers);
publicRouter.get(
    "/api/v1/members/:memberCode",
    MemberController.getMemberByCode
);
