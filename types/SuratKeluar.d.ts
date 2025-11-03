export type SuratKeluar = {
	id: string;
	judul: string;
	tanggal: Date;
	penerima: string;
	keterangan?: string | null;
	fileUrl: string;
}