import { prisma } from "@/lib/prisma";
import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import DataTableClient from './data-table-client'

export default async function User() {

	const userData = await prisma.user.findMany(
		{orderBy:
			{name: 'asc'}
		}	
	) 

	return (
		<>
			<div className="flex items-center">
				<h1 className="text-3xl font-bold">Daftar User</h1>
				<Link href="/admin/user/tambah" className="ml-auto">
					<Button type="button" className='cursor-pointer'>Tambah User</Button>
				</Link>
			</div>
			<div className="container mx-auto py-10">
				<DataTableClient initialData={userData} />
			</div>
		</>
	)
}