import { PrismaClient } from '@prisma/client'
import SuratMasukForm from '@/components/surat-masuk-form'
import React from 'react'

export default async function TambahSuratMasuk() {
    const prisma = new PrismaClient()
    const user = await prisma.user.findMany({
        select: {
            id: true,
            name: true,	
        }
    })

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-6 text-center">Tambah Surat Masuk</h1>
            <SuratMasukForm user={user}  />	
        </div>
    )
}

