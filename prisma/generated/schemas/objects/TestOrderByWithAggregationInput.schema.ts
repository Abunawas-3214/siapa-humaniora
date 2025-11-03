import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { TestCountOrderByAggregateInputObjectSchema } from './TestCountOrderByAggregateInput.schema';
import { TestMaxOrderByAggregateInputObjectSchema } from './TestMaxOrderByAggregateInput.schema';
import { TestMinOrderByAggregateInputObjectSchema } from './TestMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _count: z.lazy(() => TestCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TestMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TestMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TestOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TestOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TestOrderByWithAggregationInput>;
export const TestOrderByWithAggregationInputObjectZodSchema = makeSchema();
