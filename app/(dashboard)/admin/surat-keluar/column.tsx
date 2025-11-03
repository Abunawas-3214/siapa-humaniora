'use client'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SuratKeluar } from "@/types/SuratKeluar"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowDown, ArrowUp, Pencil, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteSuratKeluar } from "@/actions/surat-keluar"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<SuratKeluar>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'judul',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Judul
        {column.getIsSorted() === "asc" && <ArrowUp className="h-4 w-4" />}
        {column.getIsSorted() === "desc" && <ArrowDown className="h-4 w-4" />}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.judul}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'penerima',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Penerima
        {column.getIsSorted() === "asc" && <ArrowUp className="h-4 w-4" />}
        {column.getIsSorted() === "desc" && <ArrowDown className="h-4 w-4" />}
      </Button>
    ),
  },
  {
    accessorKey: 'tanggal',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Tanggal
        {column.getIsSorted() === "asc" && <ArrowUp className="h-4 w-4" />}
        {column.getIsSorted() === "desc" && <ArrowDown className="h-4 w-4" />}
      </Button>
    ),
    cell: ({ row }) => (
      <span>
        {row.original.tanggal
          ? format(new Date(row.original.tanggal), "dd MMMM yyyy")
          : "-"}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          {/* ✏️ Edit Button */}
          <Button
            variant="secondary"
            className="text-yellow-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/admin/surat-keluar/${row.original.id}/edit`)
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>

          {/* 🗑️ Delete Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                className="text-red-500 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan menghapus surat keluar: {row.original.judul}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 focus:ring-red-600 cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation()
                    await deleteSuratKeluar(row.original.id)
                    toast.success("Surat keluar berhasil dihapus")
                  }}
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]
