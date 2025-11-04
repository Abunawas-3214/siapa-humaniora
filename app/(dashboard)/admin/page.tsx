import { getSuratChartData } from '@/actions/surat-data'
import SuratChart from '@/components/surat-chart'
import React from 'react'

export const dynamic = "force-dynamic"

export default async function Admin() {
  let chartData = {}
  try {
    chartData = await getSuratChartData()
  } catch (error) {
    console.error("Error fetching chart data:", error)
  }
  return (
    <div className='space-y-6'>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <SuratChart chartDataByYear={chartData || {}} />
    </div>
  )
}

