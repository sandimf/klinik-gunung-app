import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { ArrowUpRight, DollarSign, Activity, CalendarCheck, CreditCard, Users, BarChart3 } from 'lucide-react'
import { ScrollArea } from "@/Components/ui/scroll-area"
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout"
import {Avatar, AvatarFallback,AvatarImage} from "@/Components/ui/avatar"
import { Head } from '@inertiajs/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, AreaChart, Area } from "recharts";

export default function Office({
  totalPayment,
  totalIncome,
  totalOverallIncome,
  lastPaymentDate,
  successfulTransactions,
  paymentsDetails,
  totalProductIncome,
  chartData = [],
  chartDataProduct = [],
}) {

  return (
    <CashierSidebar header={'Overview'}>
      <Head title='Cashier Dashboard' />
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Overview</h1>
          <a href={route('cashier.pdf.office')}>
          <Button>Generate Report</Button>
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
              {totalOverallIncome}
                </div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan Screening</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
              {totalIncome}
                </div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
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
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pemasukan Terbaru</CardTitle>
              <CalendarCheck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastPaymentDate}</div>
              <p className="text-xs text-muted-foreground">Last recorded payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Transaksi</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successfulTransactions}</div>
              <p className="text-xs text-muted-foreground">Successful transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Pemasukan Screening */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Tren Pemasukan Screening 6 Bulan Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ pemasukan: { label: "Pemasukan Screening", color: "#111" } }} className="min-h-[250px] w-full bg-transparent">
                <AreaChart data={chartData && chartData.length > 0 ? chartData : []}>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} stroke="#aaa" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="pemasukan"
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

