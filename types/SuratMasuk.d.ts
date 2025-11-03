export type SuratMasuk = {
	id: string;
	judul: string;
	tanggal: Date;
	pengirim: string;
	keterangan?: string | null;
	fileUrl: string;
	isEmailSent: boolean;
	assignedUsers: {
		user: {
			id: string;
			name: string;
		};
		emailStatus: string;
		assignedAt: Date;
	}[];
};