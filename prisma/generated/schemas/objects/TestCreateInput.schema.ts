import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const TestCreateInputObjectSchema: z.ZodType<Prisma.TestCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TestCreateInput>;
export const TestCreateInputObjectZodSchema = makeSchema();
