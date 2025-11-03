import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const TestMinAggregateInputObjectSchema: z.ZodType<Prisma.TestMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TestMinAggregateInputType>;
export const TestMinAggregateInputObjectZodSchema = makeSchema();
