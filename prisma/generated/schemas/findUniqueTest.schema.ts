import type { Prisma } from '../../../app/generated/prisma';
import { z } from 'zod';
import { TestSelectObjectSchema } from './objects/TestSelect.schema';
import { TestWhereUniqueInputObjectSchema } from './objects/TestWhereUniqueInput.schema';

export const TestFindUniqueSchema: z.ZodType<Prisma.TestFindUniqueArgs> = z.object({ select: TestSelectObjectSchema.optional(),  where: TestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TestFindUniqueArgs>;

export const TestFindUniqueZodSchema = z.object({ select: TestSelectObjectSchema.optional(),  where: TestWhereUniqueInputObjectSchema }).strict();