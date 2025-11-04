import { prisma } from "@/lib/prisma";
import SuratMasukForm from '@/components/surat-masuk-form'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function EditSuratMasuk({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const suratMasuk = await prisma.suratMasuk.findUnique({
    where: { id },
    include: {
      assignedUsers: {
        select: {
          user: { select: { id: true, name: true } },
          emailStatus: true,
          assignedAt: true,
        }
      }
    }
  })

  const user = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    }
  })

  if (!suratMasuk) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Surat Masuk</h1>
      <SuratMasukForm user={user} suratMasuk={suratMasuk} />
    </div>
  )
}
