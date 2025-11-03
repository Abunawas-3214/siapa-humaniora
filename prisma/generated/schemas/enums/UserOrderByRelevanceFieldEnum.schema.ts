import { z } from 'zod';

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name', 'email', 'image', 'password', 'jabatan'])

export type UserOrderByRelevanceFieldEnum = z.infer<typeof UserOrderByRelevanceFieldEnumSchema>;