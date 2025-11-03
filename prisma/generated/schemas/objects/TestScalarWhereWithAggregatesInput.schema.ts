import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

const testscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TestScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const TestScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TestScalarWhereWithAggregatesInput> = testscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TestScalarWhereWithAggregatesInput>;
export const TestScalarWhereWithAggregatesInputObjectZodSchema = testscalarwherewithaggregatesinputSchema;
