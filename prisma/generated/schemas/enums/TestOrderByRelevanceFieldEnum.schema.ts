import { z } from 'zod';

export const TestOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name'])

export type TestOrderByRelevanceFieldEnum = z.infer<typeof TestOrderByRelevanceFieldEnumSchema>;