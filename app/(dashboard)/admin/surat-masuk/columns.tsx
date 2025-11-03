'use client'
import {
	ColumnDef,
} from "@tanstack/react-table";
import { SuratMasuk } from "@/types/SuratMasuk";
import { ShieldUser, Trash, Pencil, Users, FileText, ArrowUp, ArrowDown, MoreHorizontal, BadgeCheckIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { deleteUser } from "@/actions/user";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SuratMasukDeleteData } from "@/components/surat-masuk-hapus-dialog";
import { useSession } from "next-auth/react";

// --- 1. Define Interfaces for the Setter Functions ---
interface ColumnActionProps {
	// For Delete Dialog state
	setSuratToDelete: (data: SuratMasukDeleteData | null) => void;
	setIsDeleteDialogOpen: (isOpen: boolean) => void;
	onDeleteActionSuccess: (deletedId: string) => void
}

export const columns = ({
	setSuratToDelete,
	setIsDeleteDialogOpen,
	onDeleteActionSuccess,
}: ColumnActionProps): ColumnDef<SuratMasuk>[] => {
	const { data: session } = useSession();
	const isAdmin = session?.user?.isAdmin
	const baseColumns: ColumnDef<SuratMasuk>[] = [
		// 1. SELECT COLUMN (Your starting point)
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
			header: ({ column }) => {
				return (
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
				)
			},
			cell: ({ row }) => {
				const value = row.original.judul
				const isEmailSent = row.original.isEmailSent
				return (
					<div className="flex space-y-2 items-center">
						<span className="font-medium flex items-center gap-2">
							{value}
							{
								isEmailSent ? (
									""
								) : (
									<Badge variant="outline" className="">
										<Loader className="mr-1 h-3 w-3 animate-spin" />
										Memproses Data...
									</Badge>
								)
							}
						</span>
					</div>
				)
			},
			enableHiding: false,
		},
		{
			accessorKey: 'pengirim',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="flex items-center gap-2"
					>
						Pengirim
						{column.getIsSorted() === "asc" && <ArrowUp className="h-4 w-4" />}
						{column.getIsSorted() === "desc" && <ArrowDown className="h-4 w-4" />}
					</Button>
				)
			}
		},
		{
			accessorKey: 'tanggal',
			header: ({ column }) => {
				return (
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
				)
			},
			cell: ({ row }) => {
				const value = row.original.tanggal
				return (
					<span>
						{value ? format(new Date(value), "dd MMMM yyyy") : "-"}
					</span>
				)
			}
		},
		{
			accessorKey: 'Disposisi',
			header: 'Disposisi',
			cell: ({ row }) => {
				const assignedUsers = row.original.assignedUsers || []
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 font-medium">
						<Users className="h-4 w-4" /> {assignedUsers.length}
					</span>
				);
			}
		},
	];

	if (isAdmin) {
		baseColumns.push({
			id: 'actions',
			cell: ({ row }) => {
				const documentUrl = row.original.fileUrl // adjust property name if needed
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								className="cursor-pointer flex items-center gap-2"
								onClick={(e) => {
									e.stopPropagation(); // Prevent row click
									if (documentUrl) {
										window.open(documentUrl, '_blank', 'noopener,noreferrer')
									}
								}}
							>
								<FileText className="w-4 h-4" /> Lihat Dokumen
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => e.stopPropagation()}
								className="cursor-pointer"
							>
								<Link href={`/admin/surat-masuk/${row.original.id}/edit`} className="flex items-center gap-2">
									<Pencil className="w-4 h-4" /> Edit Surat
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation(); // Prevent row click
									setSuratToDelete({
										id: row.original.id,
										judul: row.original.judul,
										pengirim: row.original.pengirim,
									});
									setIsDeleteDialogOpen(true);
								}}
								className="cursor-pointer flex items-center gap-2"
							>
								<Trash className="w-4 h-4" />Hapus Surat
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu >
				)
			}

		})
	}

	return baseColumns
}