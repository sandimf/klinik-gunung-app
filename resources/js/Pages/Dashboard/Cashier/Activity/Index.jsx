import React from 'react';
import Sidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Head,usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Printer } from 'lucide-react';

export default function Report({ patients,totalTransactions,totalPayment }) {

    const user = usePage().props.auth.user;
    return (
        <Sidebar header={'Aktivitas Transaksi'}>
            <Head title="Aktivitas Transaksi" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 no-print">
                    <h1 className="text-2xl font-bold">Laporan Aktivitas Transaksi</h1>
                    <a href={route('pdf.self.paramedis')}>
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                    </a>
                </div>

                <div className="space-y-6 no-print">
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Transaksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalTransactions}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalPayment}</div>
                            </CardContent>
                        </Card>
                        
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Pasien</TableHead>
                                <TableHead>Kasir</TableHead>
                                <TableHead>Jumlah Pembayaran</TableHead>
                                <TableHead>Metode Pembayaran</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.map((patient, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell className="font-medium">{patient.payment_by}</TableCell>
                                    <TableCell className="font-medium">{patient.amount_paid}</TableCell>
                                    <TableCell className="font-medium">{patient.payment_method}</TableCell>
                                    <TableCell>
                                        <a href={route('pdf.healthcheck.paramedis', patient.id)}>
                                            <Button>
                                                <Printer/>
                                            </Button>
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Sidebar>
    );
}

