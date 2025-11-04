"use server"

import { prisma } from "@/lib/prisma";
import { SuratChartData } from "@/types/SuratData"
import { revalidateTag, unstable_cache } from "next/cache"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

/**
 * Core function to build surat chart data from database
 */
async function fetchSuratChartData(): Promise<SuratChartData> {
  const [masuk, keluar] = await Promise.all([
    prisma.suratMasuk.findMany({
      select: { tanggal: true },
    }),
    prisma.suratKeluar.findMany({
      select: { tanggal: true },
    }),
  ])

  const dataByYear: SuratChartData = {}

  function addCount(source: typeof masuk, key: "masuk" | "keluar") {
    for (const item of source) {
      const date = new Date(item.tanggal)
      const year = date.getFullYear().toString()
      const monthIdx = date.getMonth()
      const month = MONTHS[monthIdx]

      if (!dataByYear[year]) {
        dataByYear[year] = MONTHS.map(m => ({
          month: m,
          masuk: 0,
          keluar: 0,
        }))
      }

      dataByYear[year][monthIdx][key] += 1
    }
  }

  addCount(masuk, "masuk")
  addCount(keluar, "keluar")

  return dataByYear
}

/**
 * Cached version — used for `/statistik`
 */
export const getCachedSuratChartData = unstable_cache(
  fetchSuratChartData,
  ["surat-chart-data"],     // cache key
  { tags: ["surat-chart"], revalidate: 600 } // 10 min revalidation
)

/**
 * Dynamic version — used for `/admin`
 */
export async function getSuratChartData(): Promise<SuratChartData> {
  return await fetchSuratChartData()
}

/**
 * Revalidate function — call this when suratMasuk or suratKeluar changes
 */
export async function revalidateSuratChart() {
  revalidateTag("surat-chart")
}
