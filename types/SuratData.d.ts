export interface SuratChartItem {
  month: string
  masuk: number
  keluar: number
}

export type SuratChartData = Record<string, SuratChartItem[]>
