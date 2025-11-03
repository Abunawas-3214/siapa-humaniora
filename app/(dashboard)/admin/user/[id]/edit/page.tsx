import React from 'react'
import { UserForm } from '@/components/user-form'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const prisma = new PrismaClient()
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