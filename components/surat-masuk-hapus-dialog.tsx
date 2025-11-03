'use client'
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";
import { Trash2Icon, Loader2 } from "lucide-react";
import { deleteSuratMasuk } from '@/actions/surat-masuk';

// The simplified type required for this modal
export type SuratMasukDeleteData = {
    id: string;
    judul: string;
    pengirim: string;
};

interface SuratDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    suratToDelete: SuratMasukDeleteData | null;
    // This function will be passed down from data-table.tsx to trigger a table refresh or state update
    onDeleteActionSuccess: (deletedId: string) => void;
}

export function SuratDeleteDialog({
    open,
    onOpenChange,
    suratToDelete,
    onDeleteActionSuccess
}: SuratDeleteDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to handle the actual deletion logic
    const handleDelete = async () => {
        if (!suratToDelete) return;

        setIsDeleting(true);
        setError(null);

        try {
            // --- ACTUAL DELETION LOGIC GOES HERE ---
            await deleteSuratMasuk(suratToDelete.id);

            // On successful deletion:
            onDeleteActionSuccess(suratToDelete.id);
            onOpenChange(false);

            console.log(`[DELETION SUCCESS] Surat '${suratToDelete.judul}' has been deleted.`);

        } catch (error) {
            console.error("[DELETION ERROR]", error);
            setError("Gagal menghapus surat. Silakan coba lagi.");
            // Optionally show a toast error notification here
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center space-x-2">
                        <Trash2Icon className="h-6 w-6 text-red-500" />
                        <AlertDialogTitle>Konfirmasi Hapus Surat</AlertDialogTitle>
                    </div>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Anda yakin ingin menghapus surat masuk dengan judul: 
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {" "} "{suratToDelete?.judul || 'N/A'}"
                    </span> yang dikirim oleh 
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {" "} "{suratToDelete?.pengirim || 'N/A'}"
                    </span>?
                    <br/>
                    <br/>
                    <span className="mt-10 text-sm text-red-600">Surat yang terhapus tidak dapat dikembalikan</span>
                    
                    {/* {error && (
                        <p className="mt-3 p-2 bg-red-50 border border-red-200 text-sm text-red-700 rounded-md">
                            Error: {error}
                        </p>
                    )} */}
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer" disabled={isDeleting}>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete} 
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isDeleting ? 'Menghapus...' : 'Hapus Surat'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
