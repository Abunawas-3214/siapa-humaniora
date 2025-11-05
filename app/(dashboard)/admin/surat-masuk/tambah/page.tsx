import { prisma } from "@/lib/prisma";
import SuratMasukForm from '@/components/surat-masuk-form'
import React from 'react'

export const dynamic = 'force-dynamic';

export default async function TambahSuratMasuk() {
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