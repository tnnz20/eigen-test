import { z, ZodType } from "zod";
export class BookValidation {
    static readonly CREATE: ZodType = z.object({
        code: z.string().min(1).max(10),
        title: z.string().min(3).max(100),
        author: z.string().min(3).max(100),
        stock: z.number().int().min(1),
    });

    static readonly GET_BOOKS: ZodType = z.object({
        code: z.string().min(1).max(10).optional(),
        title: z.string().min(3).max(100).optional(),
        author: z.string().min(3).max(100).optional(),
        stock: z.number().int().min(1).optional(),
        size: z.number().int().min(1).positive(),
        page: z.number().int().min(1).positive(),
    });

    static readonly BORROW_BOOK: ZodType = z.object({
        memberCode: z.string().min(1).max(10),
        bookCode: z.string().min(1).max(10).optional(),
        title: z.string().min(3).max(100).optional(),
    });

    static readonly RETURN_BOOK: ZodType = z.object({
        memberCode: z.string().min(1).max(10),
        bookCode: z.string().min(1).max(10),
    });
}
