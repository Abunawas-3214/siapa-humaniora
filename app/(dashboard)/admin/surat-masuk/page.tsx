import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PrismaClient } from "@prisma/client";
import { DataTableWithSWR } from "./data-table-swr";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SuratMasuk() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Daftar Surat Masuk</h1>
        {session?.user.isAdmin &&
          <Link href="/admin/surat-masuk/tambah" className="ml-auto">
            <Button type="button" className='cursor-pointer'>Tambah Surat Masuk</Button>
          </Link>
        }
      </div>
      <div className="container mx-auto py-10">
        {/* <DataTable columns={columns} data={suratMasukData} /> */}
        <DataTableWithSWR />
      </div>
    </>
  );
}
