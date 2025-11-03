import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const TestUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.TestUncheckedUpdateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.TestUncheckedUpdateManyInput>;
export const TestUncheckedUpdateManyInputObjectZodSchema = makeSchema();
