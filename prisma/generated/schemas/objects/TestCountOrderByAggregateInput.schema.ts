import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const TestCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TestCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TestCountOrderByAggregateInput>;
export const TestCountOrderByAggregateInputObjectZodSchema = makeSchema();
