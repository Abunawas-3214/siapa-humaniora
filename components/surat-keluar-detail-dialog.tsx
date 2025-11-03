'use client'
import { SuratKeluar } from '@/types/SuratKeluar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import React from 'react'
import { FileTextIcon } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface SuratDetailDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	surat: SuratKeluar | null;
}

/**
 * Utility function to format dates to a readable format (e.g., 02 Oktober 2025).
 * Handles Date objects or date strings.
 */
const formatDate = (date: Date | string) => {
	return new Date(date).toLocaleDateString('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});
};

/**
 * Utility function to format time (e.g., 10:15).
 * Handles Date objects or date strings.
 */
const formatTime = (date: Date | string) => {
	return new Date(date).toLocaleTimeString('id-ID', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false // Use 24-hour format
	});
};

export default function SuratKeluarDetailDialog({ open, onOpenChange, surat }: SuratDetailDialogProps) {
	if (!surat) return null;
	const formattedTanggal = formatDate(surat.tanggal);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='!max-w-xl p-6'>
				<DialogHeader>
					<DialogTitle className="text-2xl text-primary flex items-center gap-2">
						<FileTextIcon className="w-6 h-6 text-indigo-600" /> {surat.judul}
					</DialogTitle>
					<DialogDescription className="mt-1">
						Detail Surat Keluar.
					</DialogDescription>
				</DialogHeader>
				<>
					<h3 className="text-lg font-bold text-gray-800 border-b pb-2">Informasi Surat</h3>

					{/* Detail Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

						{/* Pengirim */}
						<div>
							<span className="text-sm font-medium text-gray-500">Penerima:</span>
							<p className="text-base font-semibold">{surat.penerima}</p>
						</div>

						{/* Tanggal */}
						<div>
							<span className="text-sm font-medium text-gray-500">Tanggal Surat:</span>
							<p className="text-base font-semibold">{formattedTanggal}</p>
						</div>

					</div>

					{/* Keterangan */}
					<div>
						<span className="text-sm font-medium text-gray-500">Keterangan:</span>
						<ScrollArea className="h-24 w-full rounded-md border p-3 mt-1 bg-gray-50">
							<p className={`text-sm text-justify whitespace-pre-wrap ${!surat.keterangan && 'text-gray-400 italic'}`}>
								{surat.keterangan || "Tidak ada keterangan tambahan."}
							</p>
						</ScrollArea>
					</div>
				</>
				<DialogFooter className="mt-6">
                    {/* Button to view the actual file */}
                    <Button variant="outline" asChild>
                        <a href={surat.fileUrl} target="_blank" rel="noopener noreferrer">
                            Lihat Dokumen Asli
                        </a>
                    </Button>
                </DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
