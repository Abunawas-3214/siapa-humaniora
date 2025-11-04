import { prisma } from "@/lib/prisma";
import SuratKeluarForm from '@/components/surat-keluar-form'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function EditSuratKeluar({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const suratMasuk = await prisma.suratKeluar.findUnique({
		where: { id },
	})

	if (!suratMasuk) {
		notFound()
	}
	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold mb-6 text-center">Edit Surat Masuk</h1>
			<SuratKeluarForm suratKeluar={suratMasuk} />
		</div>
	)
}
