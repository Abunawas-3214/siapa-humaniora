import { z } from 'zod';

// prettier-ignore
export const UserResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
    password: z.string(),
    jabatan: z.string().nullable(),
    isAdmin: z.boolean()
}).strict();

export type UserResultType = z.infer<typeof UserResultSchema>;
