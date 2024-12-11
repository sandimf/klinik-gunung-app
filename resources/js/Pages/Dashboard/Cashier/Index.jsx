import React from 'react';
import { Head,usePage } from "@inertiajs/react";
import Sidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
    const totalIncome = 10000000
    const totalExpense = 7000000
    const balance = totalIncome - totalExpense;

    const user = usePage().props.auth.user;
    return (
        <Sidebar header={'Patient Dashboard'}>
            <Head title="Dashboard" />
            <div className='w-full overflow-x-auto pb-2'>
                <h1 className='text-2xl font-bold tracking-tight mb-4'>Selamat Datang Di Klinik Gunung, {user.name}</h1>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="screening">Screening</TabsTrigger>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="records">Medical Records</TabsTrigger>
                        <TabsTrigger value="charts">Health Charts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pemasukan
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                Bulan ini
              </p>
            </CardContent>
          </Card>
                        </div>
                    </TabsContent>
                    {/* We'll add other TabsContent components later */}
                </Tabs>
            </div>
        </Sidebar>
    );
}
