import { getCachedSuratChartData } from '@/actions/surat-data'
import SuratChart from '@/components/surat-chart'
import React from 'react'

export const dynamic = 'force-dynamic';

export default async function Statistik() {
  const chartData = await getCachedSuratChartData()
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 text-center px-4">
      <div className="max-w-7xl w-full py-20 space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Statistik Persuratan
        </h1>
        <SuratChart chartDataByYear={chartData} />
      </div>
    </section>
  )
}
