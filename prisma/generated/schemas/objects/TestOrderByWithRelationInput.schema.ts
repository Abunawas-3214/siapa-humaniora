import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { TestOrderByRelevanceInputObjectSchema } from './TestOrderByRelevanceInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _relevance: z.lazy(() => TestOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const TestOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TestOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TestOrderByWithRelationInput>;
export const TestOrderByWithRelationInputObjectZodSchema = makeSchema();
