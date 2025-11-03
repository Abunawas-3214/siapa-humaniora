import { z } from 'zod';
import type { Prisma } from '../../../../app/generated/prisma';
import { UserSelectObjectSchema } from './UserSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => UserSelectObjectSchema).optional()
}).strict();
export const UserArgsObjectSchema = makeSchema();
export const UserArgsObjectZodSchema = makeSchema();
