import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const TestCountAggregateInputObjectSchema: z.ZodType<Prisma.TestCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TestCountAggregateInputType>;
export const TestCountAggregateInputObjectZodSchema = makeSchema();
