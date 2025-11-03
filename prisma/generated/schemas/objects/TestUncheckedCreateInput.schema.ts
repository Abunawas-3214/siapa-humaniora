import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const TestUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TestUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TestUncheckedCreateInput>;
export const TestUncheckedCreateInputObjectZodSchema = makeSchema();
