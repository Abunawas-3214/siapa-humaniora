import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { TestOrderByRelevanceFieldEnumSchema } from '../enums/TestOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([TestOrderByRelevanceFieldEnumSchema, TestOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const TestOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.TestOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.TestOrderByRelevanceInput>;
export const TestOrderByRelevanceInputObjectZodSchema = makeSchema();
