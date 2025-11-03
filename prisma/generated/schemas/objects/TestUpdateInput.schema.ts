import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const TestUpdateInputObjectSchema: z.ZodType<Prisma.TestUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.TestUpdateInput>;
export const TestUpdateInputObjectZodSchema = makeSchema();
