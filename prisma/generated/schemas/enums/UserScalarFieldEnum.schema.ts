import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'emailVerified', 'image', 'password', 'jabatan', 'isAdmin'])

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;