import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const TestMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TestMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TestMaxOrderByAggregateInput>;
export const TestMaxOrderByAggregateInputObjectZodSchema = makeSchema();
