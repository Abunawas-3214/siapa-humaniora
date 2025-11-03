import { z } from 'zod';

// prettier-ignore
export const UserInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.date().optional().nullable(),
    image: z.string().optional().nullable(),
    password: z.string(),
    jabatan: z.string().optional().nullable(),
    isAdmin: z.boolean()
}).strict();

export type UserInputType = z.infer<typeof UserInputSchema>;
