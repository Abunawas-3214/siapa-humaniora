import {z} from 'zod';

export const createSuratKeluarSchema = z.object({
	judul: z.string({
		message: 'Judul is required',
	})
		.min(1, 'Judul cannot be empty')
		.max(255, 'Judul is too long'),
	tanggal: z.date({
		message: 'Tanggal is required',
	}),
	penerima: z.string({
		message: 'Penerima is required',
	})
		.min(1, 'Penerima cannot be empty')
		.max(255, 'Penerima is too long'),
	keterangan: z.string()
		.max(500, 'Keterangan is too long')
		.optional()
		.nullable(), // Allows null, matching the Prisma model's 'String?'
	file : z.instanceof(File)
		.refine((file) =>[ file.size <= 5 * 1024 * 1024, 'File size should be less than 5MB', "application/pdf"].includes(file.type), 'Only PDF files are accepted'),
});

export type CreateSuratKeluarInut = z.infer<typeof createSuratKeluarSchema>;

// Schema for updating an existing SuratKeluar
export const updateSuratKeluarSchema = createSuratKeluarSchema.extend({
	// File can be null or undefined, but if provided, must meet the size requirement
	file: z.instanceof(File)
		.refine((file) =>[ file.size <= 5 * 1024 * 1024, 'File size should be less than 5MB', "application/pdf"].includes(file.type), 'Only PDF files are accepted')
		.optional()
		.nullable(),
});

export type UpdateSuratKeluarInput = z.infer<typeof updateSuratKeluarSchema>;