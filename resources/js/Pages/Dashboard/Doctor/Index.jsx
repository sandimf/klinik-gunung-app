import React from "react";
import { Head } from "@inertiajs/react";
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { AlertTriangle } from "lucide-react";
import AppVersion from '@/Components/app-version'

export default function Index({ waitingConsultationCount = 0, appVersion }) {
    // Dummy data, ganti dengan data dari props/backend sesuai kebutuhan
    const stats = [
        { title: "Total Sales", value: "$12,500", change: "+10%", color: "text-green-600", sub: "+10%" },
        { title: "Average Order Value", value: "$75", change: "-5%", color: "text-red-600", sub: "-5%" },
        { title: "Top Selling Item", value: "Espresso", change: "+15%", color: "text-green-600", sub: "+15%" },
    ];

    const salesSummary = {
        overTime: { value: "$12,500", sub: "Last 30 Days +10%" },
        byCategory: {
            value: "$5,000", sub: "This Month +5%", categories: [
                { name: "Coffee", value: 80 },
                { name: "Tea", value: 10 },
                { name: "Pastries", value: 60 },
                { name: "Merchandise", value: 60 },
            ]
        }
    };

    const orders = [
        { id: "#1001", customer: "Alice Johnson", date: "2024-07-26", status: "Completed", total: "$50" },
        { id: "#1002", customer: "Bob Williams", date: "2024-07-25", status: "Pending", total: "$35" },
        { id: "#1003", customer: "Charlie Davis", date: "2024-07-24", status: "Completed", total: "$60" },
        { id: "#1004", customer: "Diana Evans", date: "2024-07-23", status: "Cancelled", total: "$20" },
        { id: "#1005", customer: "Ethan Foster", date: "2024-07-22", status: "Completed", total: "$45" },
    ];

    const statusColor = {
        Completed: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Cancelled: "bg-red-100 text-red-800",
    };

    return (
        <>
            <DoctorSidebar header="Dashboard">
                <Head title="Dashboard Dokter" />

                {waitingConsultationCount > 0 && (
                    <Alert className="mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <AlertTitle>Konsultasi Baru Menunggu</AlertTitle>
                        <AlertDescription>
                            Ada <b>{waitingConsultationCount}</b> konsultasi baru yang belum diperiksa!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className={`text-xs mt-1 ${stat.color}`}>{stat.sub}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sales Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{salesSummary.overTime.value}</div>
                            <div className="text-xs text-green-600">{salesSummary.overTime.sub}</div>
                            {/* Dummy chart */}
                            <div className="h-24 mt-4 flex items-end gap-2">
                                {[40, 30, 50, 35, 60, 30, 55].map((h, i) => (
                                    <div key={i} className="bg-primary/30 w-4 rounded" style={{ height: `${h}px` }} />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>Week 1</span>
                                <span>Week 2</span>
                                <span>Week 3</span>
                                <span>Week 4</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{salesSummary.byCategory.value}</div>
                            <div className="text-xs text-green-600">{salesSummary.byCategory.sub}</div>
                            <div className="flex items-end gap-4 mt-4 h-24">
                                {salesSummary.byCategory.categories.map((cat, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="bg-muted w-6 rounded-t" style={{ height: `${cat.value}px` }} />
                                        <span className="text-xs mt-1">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Management */}
                <h2 className="text-xl font-bold mb-2">Daftar Konsultasi Dokter Belum Diperiksa</h2>
                <div className="rounded-md border bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        <Badge className={statusColor[order.status]}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{order.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DoctorSidebar>
            {/* App Version at bottom right */}
            <AppVersion appVersion={appVersion} />
        </>
    );
}
