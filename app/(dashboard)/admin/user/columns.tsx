'use client'
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/User";
import { ShieldUser, Trash, Pencil, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { deleteUser } from "@/actions/user";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function useUserColumns(): ColumnDef<User>[] {
	const { data: session } = useSession();
	const isSuperAdminSession = session?.user?.isSuperAdmin
	const columns: ColumnDef<User>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => <div className="font-medium">
				{row.original.name}
				{(row.original.isAdmin && !row.original.isSuperAdmin) && <ShieldUser className="inline-block ml-2 mb-1 w-4 h-4 text-blue-500" />}
				{row.original.isSuperAdmin && <Crown className="inline-block ml-2 mb-1 w-4 h-4 text-yellow-500" />}
			</div>,
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'jabatan',
			header: 'Jabatan',
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => (
				<div className="flex space-x-2">
					{
						row.original.isSuperAdmin ? (
							isSuperAdminSession && (
								<Link href={`/admin/user/${row.original.id}/edit`}>
									<Button variant={"secondary"} className="text-yellow-500 cursor-pointer">
										<Pencil className="w-4 h-4" />
									</Button>
								</Link>
							)
						) : (
							<>
								<Link href={`/admin/user/${row.original.id}/edit`}>
									<Button variant={"secondary"} className="text-yellow-500 cursor-pointer">
										<Pencil className="w-4 h-4" />
									</Button>
								</Link>
								<AlertDialog>
									<AlertDialogTrigger>
										<Button asChild variant={"secondary"} className="text-red-500 cursor-pointer">
											<span><Trash className="w-4 h-4" /></span>
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Aapakah anda yakin?</AlertDialogTitle>
											<AlertDialogDescription>
												Anda akan menghapus user {row.original.name}.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
											<AlertDialogAction
												className="bg-red-500 hover:bg-red-600 focus:ring-red-600 cursor-pointer"
												onClick={async () => {
													await deleteUser(row.original.id)
													toast.success("User berhasil dihapus")
												}}
											>
												Hapus
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</>
						)
					}

				</div>
			),
		}
	];
	return columns;
}