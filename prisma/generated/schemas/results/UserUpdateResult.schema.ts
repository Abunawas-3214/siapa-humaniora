import { z } from 'zod';
export const UserUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.date().optional(),
  image: z.string().optional(),
  password: z.string(),
  jabatan: z.string().optional(),
  isAdmin: z.boolean()
}));