import express from "express";
import { MemberController } from "../domains/member/member-controller";

export const publicRouter = express.Router();

publicRouter
    .route("/api/v1/members")
    .post(MemberController.create)
    .get(MemberController.getMembers);

publicRouter
    .route("/api/v1/members/:memberCode")
    .get(MemberController.getMemberByCode);
