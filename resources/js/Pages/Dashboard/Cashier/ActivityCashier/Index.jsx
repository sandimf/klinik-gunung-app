import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Head } from "@inertiajs/react";
import AppSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Image } from "lucide-react";
export default function Index({
    cashierActivities,
    totalPayment,
    totalTransactions,
    paymentMethodsCount,
}) {
    return (
        <AppSidebar header={"Aktivitas Kasir"}>
            <div className="space-y-6">
                <Head title="Aktivitas Kasir" />
                <h1 className="text-2xl font-bold">Aktivitas Kasir</h1>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Total Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalPayment}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Total Transaksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {totalTransactions} Transaksi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Metode Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Object.entries(paymentMethodsCount).map(
                                ([method, count]) => (
                                    <div
                                        key={method}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="text-muted-foreground">
                                            {method}
                                        </span>
                                        <span className="font-medium">
                                            {count} transaksi
                                        </span>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            No.
                                        </TableHead>
                                        <TableHead>Nama Pasien</TableHead>
                                        <TableHead>Dibayar</TableHead>
                                        <TableHead>Metode Pembayaran</TableHead>
                                        <TableHead>Kasir</TableHead>
                                        <TableHead>Bukti Pembayaran</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cashierActivities.map(
                                        (activity, index) => (
                                            <TableRow key={activity.id}>
                                                <TableCell className="text-center">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.patient_name}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.amount_paid}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.payment_method}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.cashier_name}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.payment_proof && (
                                                        <Dialog>
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                >
                                                                    <Image className="w-4 h-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-3xl">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Bukti
                                                                        Pembayaran
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <div className="mt-4">
                                                                    <img
                                                                        src={
                                                                            `/storage/${activity.payment_proof}` ||
                                                                            "/placeholder.svg"
                                                                        }
                                                                        alt="Bukti Pembayaran"
                                                                        className="w-full h-auto rounded-lg"
                                                                    />
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.created_at}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppSidebar>
    );
}
