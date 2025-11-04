"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SuratChartData } from "@/types/SuratData"

// Dummy chart data per year
const chartDataByYear: Record<string, { month: string; masuk: number; keluar: number }[]> = {
  "2023": [
    { month: "Jan", masuk: 12, keluar: 22 },
    { month: "Feb", masuk: 18, keluar: 15 },
    { month: "Mar", masuk: 25, keluar: 30 },
    { month: "Apr", masuk: 15, keluar: 20 },
    { month: "May", masuk: 28, keluar: 25 },
    { month: "Jun", masuk: 22, keluar: 18 },
    { month: "Jul", masuk: 30, keluar: 35 },
    { month: "Aug", masuk: 32, keluar: 28 },
    { month: "Sep", masuk: 27, keluar: 33 },
    { month: "Oct", masuk: 35, keluar: 38 },
    { month: "Nov", masuk: 29, keluar: 31 },
    { month: "Dec", masuk: 40, keluar: 45 },
  ],
  "2024": [
    { month: "Jan", masuk: 30, keluar: 40 },
    { month: "Feb", masuk: 35, keluar: 38 },
    { month: "Mar", masuk: 40, keluar: 35 },
    { month: "Apr", masuk: 45, keluar: 50 },
    { month: "May", masuk: 42, keluar: 44 },
    { month: "Jun", masuk: 48, keluar: 47 },
    { month: "Jul", masuk: 50, keluar: 52 },
    { month: "Aug", masuk: 55, keluar: 57 },
    { month: "Sep", masuk: 53, keluar: 50 },
    { month: "Oct", masuk: 58, keluar: 55 },
    { month: "Nov", masuk: 60, keluar: 63 },
    { month: "Dec", masuk: 65, keluar: 70 },
  ],
}



export default function SuratChart({ chartDataByYear }: { chartDataByYear: SuratChartData }) {
  const years = Object.keys(chartDataByYear).sort().reverse()
  const latestYear = years[0]
  const [year, setYear] = useState(latestYear)

  const chartData = chartDataByYear[year] || [] // 👈 fallback if undefined

  const totals = {
    masuk: chartData.reduce((a, b) => a + (b.masuk || 0), 0),
    keluar: chartData.reduce((a, b) => a + (b.keluar || 0), 0),
  }

  const hasData = chartData.length > 0

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2 border-b">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Surat Masuk & Keluar per Bulan
          </CardTitle>

          {years.length > 0 ? (
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px] text-sm">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((yr) => (
                  <SelectItem key={yr} value={yr}>
                    {yr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada data</p>
          )}
        </div>

        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Surat Masuk</p>
            <p className="text-2xl font-bold">
              {totals.masuk.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Surat Keluar</p>
            <p className="text-2xl font-bold">
              {totals.keluar.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 h-[350px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="masuk" fill="#3b82f6" name="Surat Masuk" />
              <Bar dataKey="keluar" fill="#10b981" name="Surat Keluar" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Tidak ada data surat untuk ditampilkan
          </div>
        )}
      </CardContent>
    </Card>
  )
}
