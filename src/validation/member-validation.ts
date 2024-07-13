import { z, ZodType } from "zod";

export class MemberValidation {
    static readonly CREATE: ZodType = z.object({
        code: z.string().min(1).max(10),
        name: z.string().min(1).max(100),
    });

    static readonly GET_MEMBERS: ZodType = z.object({
        code: z.string().min(1).max(10).optional(),
        name: z.string().min(3).max(10).optional(),
        size: z.number().int().min(1).positive(),
        page: z.number().int().min(1).positive(),
    });
}
