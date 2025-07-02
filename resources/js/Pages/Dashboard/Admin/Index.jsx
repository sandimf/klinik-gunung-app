import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Users, CreditCard, Activity, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    // Data dummy untuk demonstrasi. Ganti dengan data dari backend Anda.
    const stats = [
        { title: "Total Pendapatan", value: "Rp 45.231.890", change: "+20.1% dari bulan lalu", icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
        { title: "Langganan Aktif", value: "+2350", change: "+180.1% dari bulan lalu", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { title: "Penjualan", value: "+12,234", change: "+19% dari bulan lalu", icon: <CreditCard className="h-4 w-4 text-muted-foreground" /> },
        { title: "Aktivitas Sekarang", value: "573", change: "+201 sejak jam terakhir", icon: <Activity className="h-4 w-4 text-muted-foreground" /> },
    ];

    const recentSales = [
        { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "Rp 1.999.000" },
        { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "Rp 390.000" },
        { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "Rp 299.000" },
        { name: "William Kim", email: "will@email.com", amount: "Rp 990.000" },
        { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "Rp 390.000" },
    ];

    return (
        <AdminSidebar header={'Dashboard'}>
            <Head title='Admin Dashboard' />
            <div className="space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Selamat Datang Kembali, {user.name}! 👋</h2>
                </div>

                {/* Kartu Statistik */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Area Konten Utama dengan Grafik dan Penjualan Terkini */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Ringkasan</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {/* Komponen grafik akan ditempatkan di sini. Contoh: <OverviewChart /> */}
                            <div className="h-[350px] w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md">
                                <p className="text-muted-foreground">Placeholder untuk Grafik (misal: menggunakan Recharts)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-4 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Penjualan Terkini</CardTitle>
                            <CardDescription>
                                Anda telah melakukan {recentSales.length} penjualan bulan ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentSales.map((sale, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted-foreground/20">
                                            <span className='font-bold text-muted-foreground'>{sale.name.charAt(0)}</span>
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{sale.name}</p>
                                            <p className="text-sm text-muted-foreground">{sale.email}</p>
                                        </div>
                                        <div className="ml-auto font-medium">{sale.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminSidebar>
    );
}
