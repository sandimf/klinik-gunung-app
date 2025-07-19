import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { ArrowUpRight, DollarSign, Activity, CalendarCheck, CreditCard, Users, BarChart3 } from 'lucide-react'
import { ScrollArea } from "@/Components/ui/scroll-area"
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Head } from '@inertiajs/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, AreaChart, Area } from "recharts";
import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/Components/ui/select";
import { toast } from "sonner";

export default function index({
  totalPayment,
  totalIncome,
  totalOverallIncome,
  lastPaymentDate,
  successfulTransactions,
  paymentsDetails,
  totalProductIncome,
  chartData = [],
  chartDataProduct = [],
  chartDataDaily = [],
  chartDataWeekly = [],
  chartDataMonthly = [],
  todayIncome,
}) {
  // Filter periode: day, week, month
  const [period, setPeriod] = useState("month");
  let chartDataPeriod = chartDataMonthly;
  if (period === "day") chartDataPeriod = chartDataDaily;
  else if (period === "week") chartDataPeriod = chartDataWeekly;

  function getPercentChange(data, key = "total") {
    if (!data || data.length < 2) return 0;
    const last = data[data.length - 1]?.[key] || 0;
    const prev = data[data.length - 2]?.[key] || 0;
    if (prev === 0) {
      if (last > 0) return 100;
      return 0;
    }
    return ((last - prev) / prev) * 100;
  }
  const percentChange = getPercentChange(chartDataPeriod, "total");
  // Untuk card screening dan produk, tetap pakai data bulanan:
  const percentScreening = getPercentChange(chartDataMonthly, "total");
  const percentProduct = getPercentChange(chartDataProduct, "produk");

  return (
    <CashierSidebar header={'Ringkasan'}>
      <Head title='Dashboard Kasir' />
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Ringkasan</h1>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hari</SelectItem>
                <SelectItem value="week">Minggu</SelectItem>
                <SelectItem value="month">Bulan</SelectItem>
              </SelectContent>
            </Select>
            <a href={route('cashier.pdf.office')}>
              <Button>Unduh Laporan</Button>
            </a>
          </div>
        </div>

        {/* Filter Periode */}
        {/* Hapus tabs lama filter periode di bawah header */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalOverallIncome}
              </div>
              <p
                className={
                  "text-xs " +
                  (percentChange > 0
                    ? "text-green-600"
                    : percentChange < 0
                      ? "text-red-600"
                      : "text-muted-foreground")
                }
              >
                {percentChange >= 0 ? "+" : ""}
                {percentChange.toFixed(1)}% {period === "day" ? "hari ini" : period === "week" ? "minggu ini" : "bulan ini"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pemasukan Screening</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalIncome}
              </div>
              <p className="text-xs text-muted-foreground">
                {percentScreening >= 0 ? "+" : ""}
                {percentScreening.toFixed(1)}% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan Produk</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalProductIncome}
              </div>
              <p className="text-xs text-muted-foreground">
                {percentProduct >= 0 ? "+" : ""}
                {percentProduct.toFixed(1)}% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pemasukan Hari Ini</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayIncome}</div>
              <p className="text-xs text-muted-foreground">Total pemasukan hari ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pemasukan Terbaru</CardTitle>
              <CalendarCheck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastPaymentDate}</div>
              <p className="text-xs text-muted-foreground">Pembayaran terakhir tercatat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Transaksi</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successfulTransactions}</div>
              <p className="text-xs text-muted-foreground">Transaksi berhasil</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Pemasukan Screening */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Tren Pemasukan Screening ({period === "day" ? "Harian" : period === "week" ? "Mingguan" : "Bulanan"})</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ pemasukan: { label: "Pemasukan Screening", color: "#111" } }} className="min-h-[250px] w-full bg-transparent">
                <AreaChart data={chartDataPeriod && chartDataPeriod.length > 0 ? chartDataPeriod : []}>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey={period === "day" ? "date" : period === "week" ? "week_start" : "month"} tickLine={false} tickMargin={10} axisLine={false} stroke="#aaa" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#111"
                    fill="#f4f4f5"
                    fillOpacity={1}
                    strokeWidth={2}
                    dot={{ r: 6, fill: '#fff', stroke: '#111', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#fff', stroke: '#111', strokeWidth: 2 }}
                    className="dark:stroke-white dark:fill-zinc-900"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          {/* Chart 2: Pemasukan Produk */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Tren Pemasukan Produk 6 Bulan Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ produk: { label: "Pemasukan Produk", color: "#111" } }} className="min-h-[250px] w-full bg-transparent">
                <AreaChart data={chartDataProduct && chartDataProduct.length > 0 ? chartDataProduct : []}>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} stroke="#aaa" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="produk"
                    stroke="#111"
                    fill="#f4f4f5"
                    fillOpacity={1}
                    strokeWidth={2}
                    dot={{ r: 6, fill: '#fff', stroke: '#111', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#fff', stroke: '#111', strokeWidth: 2 }}
                    className="dark:stroke-white dark:fill-zinc-900"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </CashierSidebar>
  )
}

