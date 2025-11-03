import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const TestCreateManyInputObjectSchema: z.ZodType<Prisma.TestCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.TestCreateManyInput>;
export const TestCreateManyInputObjectZodSchema = makeSchema();
