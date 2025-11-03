import { z } from 'zod';

export const TestScalarFieldEnumSchema = z.enum(['id', 'name'])

export type TestScalarFieldEnum = z.infer<typeof TestScalarFieldEnumSchema>;