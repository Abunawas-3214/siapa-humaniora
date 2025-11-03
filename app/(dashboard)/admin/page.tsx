export const dynamic = 'force-dynamic'
export const revalidate = 0

import { getSuratChartData } from '@/actions/surat-data'
import SuratChart from '@/components/surat-chart'
import React from 'react'

export default async function Admin() {
  const chartData = await getSuratChartData()
  return (
    <div className='space-y-6'>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <SuratChart chartDataByYear={chartData}/>
    </div>
  )
}

