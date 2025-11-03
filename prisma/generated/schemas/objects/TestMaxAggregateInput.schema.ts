import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const TestMaxAggregateInputObjectSchema: z.ZodType<Prisma.TestMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TestMaxAggregateInputType>;
export const TestMaxAggregateInputObjectZodSchema = makeSchema();
