import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const TestMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TestMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TestMinOrderByAggregateInput>;
export const TestMinOrderByAggregateInputObjectZodSchema = makeSchema();
