import React from 'react'
import { prisma } from "@/lib/prisma";
import { UserForm } from '@/components/user-form'
import { notFound } from 'next/navigation'

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit User</h1>
      <UserForm user={user} />
    </div>
  )
}