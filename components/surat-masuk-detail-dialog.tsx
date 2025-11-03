'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileTextIcon, UserCheckIcon } from "lucide-react";
import { SuratMasuk } from "@/types/SuratMasuk";
import { ScrollArea } from "./ui/scroll-area";

// Assuming a simplified type for the data passed to the dialog
// In a real application, you might fetch more details here.

interface SuratDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    surat: SuratMasuk | null;
}


/**
 * Utility function to format dates to a readable format (e.g., 02 Oktober 2025).
 * Handles Date objects or date strings.
 */
const formatDate = (date: Date | string ) => {
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

export function SuratMasukDetailDialog({ open, onOpenChange, surat }: SuratDetailDialogProps) {
    if (!surat) return null;

    const formattedTanggal = formatDate(surat.tanggal);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Increase max-width to accommodate the two-column layout */}
            <DialogContent className="!max-w-5xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-primary flex items-center gap-2">
                        <FileTextIcon className="w-6 h-6 text-indigo-600" /> {surat.judul}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                        Detail Surat Masuk dan Status Disposisi Pengguna.
                    </DialogDescription>
                </DialogHeader>

                {/* Main Content: Two-Column Layout (responsive grid) */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4">
                    
                    {/* LEFT COLUMN: Surat Details (3/5 width) */}
                    <div className="md:col-span-3 space-y-4 pr-4 border-r md:border-r border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Informasi Surat</h3>

                        {/* Detail Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Pengirim */}
                            <div>
                                <span className="text-sm font-medium text-gray-500">Pengirim:</span>
                                <p className="text-base font-semibold">{surat.pengirim}</p>
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
                        
                        {/* Overall Email Status */}
                        <div>
                            <span className="text-sm font-medium text-gray-500">Status Notifikasi Global:</span>
                            <div className={`text-base font-bold mt-1 ${surat.isEmailSent ? 'text-green-600' : 'text-yellow-600'}`}>
                                {surat.isEmailSent ? 'Selesai Diproses' : 'Sedang Diproses (Notifikasi Pengguna)'}
                            </div>
                        </div>
                    </div>
                    
                    {/* RIGHT COLUMN: Disposisi List (2/5 width) */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Penerima Disposisi ({surat.assignedUsers.length})</h3>

                        {/* Scrollable User List */}
                        <ScrollArea className="h-72 w-full pr-4">
                            <div className="space-y-3">
                                {surat.assignedUsers.length === 0 ? (
                                    <p className="text-sm text-gray-500 pt-2">Belum ada pengguna yang ditugaskan.</p>
                                ) : (
                                    surat.assignedUsers.map((assignment, index) => {
                                        const emailSentStatus = assignment.emailStatus;
                                        const statusColor = emailSentStatus === 'SENT' ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100';
                                        
                                        return (
                                            <div 
                                                key={index} 
                                                className="p-3 bg-white rounded-lg border shadow-sm flex items-center justify-between transition-shadow hover:shadow-md"
                                            >
                                                <div>
                                                    {/* User Name */}
                                                    <p className="font-semibold text-base">
                                                        {assignment.user.name}
                                                    </p>
                                                </div>
                                                
                                                {/* Status and Date/Time (As per image reference) */}
                                                <div className="text-right ml-4">
                                                    <span 
                                                        className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${statusColor}`}
                                                    >
                                                        {emailSentStatus}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(assignment.assignedAt).replace(/, \d{4}/, '')} {formatTime(assignment.assignedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

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
    );
}
