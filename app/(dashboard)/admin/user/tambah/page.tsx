import React from 'react'
import { UserForm } from '@/components/user-form'

export default function TambahUser() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Tambah User</h1>
      <UserForm /> 
    </div>
  )
}
