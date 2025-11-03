import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import DataTable from './data-table'
import { columns } from './column'
import { PrismaClient } from '@prisma/client'

export default async function SuratKeluar() {
	const prisma = new PrismaClient()

  const data = await prisma.suratKeluar.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return (
    <>
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>Daftar Surat Keluar</h1>
        <Link href="/admin/surat-keluar/tambah" className="ml-auto">
          <Button type="button" className='cursor-pointer'>Tambah Surat Keluar</Button>
        </Link>

      </div>
      <div className="container mx-auto py-10">
<DataTable columns={columns} data={data}/>
      </div>
    </>
  )
}
