import { z, ZodType } from "zod";
export class BookValidation {
    static readonly CREATE: ZodType = z.object({
        code: z.string().min(1).max(10),
        title: z.string().min(1).max(100),
        author: z.string().min(1).max(100),
        stock: z.number().int().min(1),
    });
}
