import SuratKeluarForm from '@/components/surat-keluar-form'
import React from 'react'

export default function TambahSuratKeluar() {
	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold mb-6 text-center">Tambah Surat Keluar</h1>
			<SuratKeluarForm />
		</div>
	)
}
