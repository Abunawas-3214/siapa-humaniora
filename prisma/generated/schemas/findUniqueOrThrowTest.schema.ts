import type { Prisma } from '../../../app/generated/prisma';
import { z } from 'zod';
import { TestSelectObjectSchema } from './objects/TestSelect.schema';
import { TestWhereUniqueInputObjectSchema } from './objects/TestWhereUniqueInput.schema';

export const TestFindUniqueOrThrowSchema: z.ZodType<Prisma.TestFindUniqueOrThrowArgs> = z.object({ select: TestSelectObjectSchema.optional(),  where: TestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TestFindUniqueOrThrowArgs>;

export const TestFindUniqueOrThrowZodSchema = z.object({ select: TestSelectObjectSchema.optional(),  where: TestWhereUniqueInputObjectSchema }).strict();