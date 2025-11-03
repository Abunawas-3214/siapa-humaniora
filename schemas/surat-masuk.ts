import { z } from 'zod';

export const createSuratMasukSchema = z.object({
	judul: z.string({
		message: 'Judul is required',
	})
		.min(1, 'Judul cannot be empty')
		.max(255, 'Judul is too long'),

	tanggal: z.date({
		message: 'Tanggal is required',
	}),

	pengirim: z.string({
		message: 'Pengirim is required',
	})
		.min(1, 'Pengirim cannot be empty')
		.max(255, 'Pengirim is too long'),

	keterangan: z.string()
		.max(500, 'Keterangan is too long')
		.optional()
		.nullable(), // Allows null, matching the Prisma model's 'String?'

	file : z.instanceof(File)
		.refine((file) =>[ file.size <= 5 * 1024 * 1024, 'File size should be less than 5MB', "application/pdf"].includes(file.type), 'Only PDF files are accepted'),

	disposisiUserIds: z.array(z.string())
		.min(1, 'At least one user must be assigned')
})

export type CreateSuratMasukInput = z.infer<typeof createSuratMasukSchema>;

// Schema for updating an existing SuratMasuk
export const updateSuratMasukSchema = createSuratMasukSchema.extend({
	// File can be null or undefined, but if provided, must meet the size requirement
	file: z.instanceof(File)
		.refine((file) =>[ file.size <= 5 * 1024 * 1024, 'File size should be less than 5MB', "application/pdf"].includes(file.type), 'Only PDF files are accepted')
		.optional()
		.nullable(),
	
	resend: z.boolean().default(false).optional()
});
export type UpdateSuratMasukInput = z.infer<typeof updateSuratMasukSchema>;