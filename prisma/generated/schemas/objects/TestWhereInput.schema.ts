import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema'

const testwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TestWhereInputObjectSchema), z.lazy(() => TestWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TestWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TestWhereInputObjectSchema), z.lazy(() => TestWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const TestWhereInputObjectSchema: z.ZodType<Prisma.TestWhereInput> = testwhereinputSchema as unknown as z.ZodType<Prisma.TestWhereInput>;
export const TestWhereInputObjectZodSchema = testwhereinputSchema;
