import { z, ZodType } from "zod";

export class MemberValidation {
    static readonly REGISTER: ZodType = z.object({
        code: z.string().min(1).max(10),
        name: z.string().min(1).max(100),
    });
}
