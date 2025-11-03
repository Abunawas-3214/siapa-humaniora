import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { TestSelectObjectSchema } from './TestSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TestSelectObjectSchema).optional()
}).strict();
export const TestArgsObjectSchema = makeSchema();
export const TestArgsObjectZodSchema = makeSchema();
