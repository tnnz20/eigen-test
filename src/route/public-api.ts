import express from "express";
import { MemberController } from "../domains/member/member-controller";
import { BookController } from "../domains/book/book-controller";

export const publicRouter = express.Router();

publicRouter
    .route("/api/v1/members")
    .post(MemberController.create)
    .get(MemberController.getMembers);

publicRouter
    .route("/api/v1/members/:memberCode")
    .get(MemberController.getMemberByCode);

publicRouter
    .route("/api/v1/books")
    .post(BookController.create)
    .get(BookController.getBooks);
