'use client'
import React from 'react'
import { useUserColumns } from './columns'
import { DataTable } from './data-table'

export default function DataTableClient({ initialData }: { initialData: any }) {
	const columns = useUserColumns()
	return (
		<DataTable columns={columns} data={initialData} />
	)
}
