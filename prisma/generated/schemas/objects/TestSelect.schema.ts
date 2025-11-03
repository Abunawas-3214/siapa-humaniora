import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional()
}).strict();
export const TestSelectObjectSchema: z.ZodType<Prisma.TestSelect> = makeSchema() as unknown as z.ZodType<Prisma.TestSelect>;
export const TestSelectObjectZodSchema = makeSchema();
