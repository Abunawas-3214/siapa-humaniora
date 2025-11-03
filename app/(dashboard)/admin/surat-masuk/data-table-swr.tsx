'use client';

import useSWR from 'swr';
import { DataTable } from "./data-table"; // Your existing data table component
import { columns } from "./columns"; // Your existing column definitions
import { SuratMasuk } from '@/types/SuratMasuk';
import { useState } from 'react';
import { SuratDeleteDialog, SuratMasukDeleteData } from '@/components/surat-masuk-hapus-dialog';

// 1. Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export function DataTableWithSWR() {

  // 2. Use SWR to fetch and poll the API route
  const { data, error, isLoading, mutate } = useSWR<SuratMasuk[]>(
    '/api/surat-masuk',
    fetcher,
    {
      refreshInterval: 30000,
    }
  );

  // --- 2. Delete Dialog State Management ---
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [suratToDelete, setSuratToDelete] = useState<SuratMasukDeleteData | null>(null);

  const handleDeleteSuccess = (deletedId: string) => {
    // This function is called by the dialog upon successful server deletion.
    // It instantly updates the SWR cache using mutate, filtering out the deleted ID.
    mutate(
      (currentData) => currentData?.filter(item => item.id !== deletedId),
      { revalidate: false } // Tells SWR not to re-fetch immediately, relies on cache update
    );
    setSuratToDelete(null);
    setIsDeleteDialogOpen(false);
  }

  const columnArray = columns({
    setSuratToDelete,
    setIsDeleteDialogOpen,
    onDeleteActionSuccess: handleDeleteSuccess, // Pass the SWR handler
  });

  if (error) return <div className="p-4 text-red-600">Gagal memuat data. Periksa koneksi atau log server.</div>;
  if (isLoading || !data) {
    // Show a loading state while the first fetch is happening
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Memuat data surat masuk...</p>
      </div>
    );
  }

  // 3. Pass the dynamically fetched data to the existing DataTable
  return (
    <>
      <DataTable columns={columnArray} data={data} />;
      {/* Render the Delete Dialog component */}
      <SuratDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        suratToDelete={suratToDelete}
        onDeleteActionSuccess={handleDeleteSuccess}
      />
    </>
  )
}
