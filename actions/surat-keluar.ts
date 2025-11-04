'use server'

import { createSuratKeluarSchema } from "@/schemas/surat-keluar"
import { Prisma} from "@prisma/client"
import { prisma } from "@/lib/prisma";
import fs from 'fs/promises'
import { revalidatePath } from "next/cache"
import path from "path"
import { revalidateSuratChart } from "./surat-data"

const PUBLIC_DIR = path.join(process.cwd(), 'uploads', 'surat-keluar')

export async function createSuratKeluar(data: FormData) {
	const rawData = {
		judul: data.get("judul") as string,
		tanggal: new Date(data.get("tanggal") as string),
		penerima: data.get("penerima") as string,
		keterangan: data.get("keterangan") as string,
		file: data.get("file") as File,
	}

	const validatedFields = createSuratKeluarSchema.safeParse(rawData)

	if (!validatedFields.success) {
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Validation failed.',
		}
	}

	const { judul, tanggal, penerima, keterangan, file } = validatedFields.data

	const suratTanggal = new Date(tanggal)

	const buffer = Buffer.from(await file.arrayBuffer())
	const filname = `${Date.now()}_${file.name}`
	const filePath = path.join(PUBLIC_DIR, filname)

	await fs.mkdir(PUBLIC_DIR, { recursive: true })
	await fs.writeFile(filePath, buffer)

	const fileUrl = `/uploads/surat-keluar/${filname}`

	try {
		await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
			const suratKeluar = await tx.suratKeluar.create({
				data: {
					judul,
					tanggal: suratTanggal,
					penerima,
					keterangan,
					fileUrl,
				},
			})
			return suratKeluar
		})

		// Revalidate the path to update any cached data
		revalidatePath('/admin/surat-keluar')
		await revalidateSuratChart()

	} catch (error) {
		// Log the error and fail the Server Action
		console.error('DATABASE TRANSACTION OR FILE WRITE ERROR:', error);
		return {
			success: false,
			message: 'Failed to create record or assign users due to a system error.',
		};
	}
}

export async function updateSuratKeluar(id: string, data: FormData) {
	const rawData = {
		judul: data.get("judul") as string,
		tanggal: data.get("tanggal") as string,
		penerima: data.get("penerima") as string,
		keterangan: data.get("keterangan") as string,
		file: data.get("file") as File,
	}

	const validatedFields = createSuratKeluarSchema.safeParse(rawData)
	if (!validatedFields.success) {
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Validation failed.',
		}
	}

	const { judul, tanggal, penerima, keterangan, file } = validatedFields.data
	const suratTanggal = new Date(tanggal)
	let newfileUrl: string | undefined = undefined
	try {
		if (file && file.size > 0) {
			const existingSurat = await prisma.suratKeluar.findUnique({ where: { id }, select: { fileUrl: true } })
			if (existingSurat?.fileUrl) {
				const existingFilePath = path.join(process.cwd(), 'uploads', existingSurat.fileUrl)
				await fs.unlink(existingFilePath).catch((err) => {
					console.warn('Failed to delete existing file:', err.message);
				})
			}
			const buffer = Buffer.from(await file.arrayBuffer())
			const filname = `${Date.now()}_${file.name}`
			const filePath = path.join(PUBLIC_DIR, filname)

			await fs.mkdir(PUBLIC_DIR, { recursive: true })
			await fs.writeFile(filePath, buffer)

			newfileUrl = `/uploads/surat-keluar/${filname}`
		}
	} catch (error) {
		console.error('FILE HANDLING ERROR:', error);
		return {
			success: false,
			message: 'Failed to process the uploaded file.',
		}
	}

	try {
		await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
			await tx.suratKeluar.update({
				where: { id },
				data: {
					judul,
					tanggal: suratTanggal,
					penerima,
					keterangan,
					...(newfileUrl && { fileUrl: newfileUrl }),
				},
			})
		})

		// Revalidate the path to update any cached data
		revalidatePath('/admin/surat-keluar')
		await revalidateSuratChart()

	} catch (error) {
		console.error('DATABASE TRANSACTION ERROR DURING UPDATE:', error);
		return {
			success: false,
			message: 'Failed to update record or disposisi users due to a system error.',
		}
	}
}

export async function deleteSuratKeluar(id: string) {
	const suratKeluar = await prisma.suratKeluar.findUnique({
		where: { id },
		select: { fileUrl: true },
	})
	if (suratKeluar?.fileUrl) {
		const filePath = path.join(process.cwd(), 'uploads', suratKeluar.fileUrl)
		await fs.unlink(filePath).catch((err) => {
			console.warn('Failed to delete file during record deletion:', err.message);
		})
	}
	await prisma.suratKeluar.delete({
		where: { id },
	})
	// Revalidate the path to update any cached data
	revalidatePath('/admin/surat-keluar')
	await revalidateSuratChart()
}