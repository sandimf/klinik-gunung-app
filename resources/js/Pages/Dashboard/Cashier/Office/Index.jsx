'use client'

import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { ArrowUpRight, DollarSign, Activity, CalendarCheck, CreditCard, Users, BarChart3 } from 'lucide-react'
import { ScrollArea } from "@/Components/ui/scroll-area"
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout"
import {Avatar, AvatarFallback,AvatarImage} from "@/Components/ui/avatar"
import { Head } from '@inertiajs/react';

export default function Office({
  totalIncome,
  lastPaymentDate,
  successfulTransactions,
  paymentsDetails,
}) {
  return (
    <CashierSidebar header={'Office'}>
      <Head title='Office' />
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Office Klinik Gunung</h1>
          <Button>Generate Report</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalIncome)}
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">Current balance</p>
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

        <Tabs defaultValue="report" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="report">Laporan Detail</TabsTrigger>
            <TabsTrigger value="activity">Aktivitas</TabsTrigger>
          </TabsList>
          <TabsContent value="report">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Aktivitas Keuangan</CardTitle>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Pemasukan</span>
                    <span className="text-sm font-bold text-green-600">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(totalIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Saldo</span>
                    <span className="text-sm font-bold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(totalIncome)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Aktivitas Pembayaran</CardTitle>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {paymentsDetails.map((payment) => (
                      <div key={uuidv4()} className="flex items-center space-x-4 rounded-lg border p-4">
                        <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={
                                payment.patient_avatar
                                    ? payment.patient_avatar.startsWith("http")
                                        ? payment.patient_avatar
                                        : `/storage/${payment.patient_avatar}`
                                    : "/storage/avatar/avatar.jpg"
                            }
                            alt={payment.patient_name || "Klinik gunung"}
                        />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {payment.patient_name.split(' ').map(name => name[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{payment.patient_name}</p>
                          <p className="text-sm text-muted-foreground">{payment.medicine_details}</p>
                          <p className="text-xs text-muted-foreground">{payment.quantity_details}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(payment.amount_paid)}
                          </p>
                          <p className="text-xs text-muted-foreground">{payment.formatted_date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CashierSidebar>
  )
}

