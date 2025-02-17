import { useState } from "react";
import { Head } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Toaster } from "sonner";
import useFlashToast from "@/hooks/flash";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableCaption,
} from "@/Components/ui/table";

export default function Product({ transactions }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransaction = transactions.data.filter((transaction) =>
        Object.values(transaction).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    useFlashToast();
    return (
        <CashierSidebar header="Produk">
            <Head title="Produk" />
            <Toaster position="top-center" />
            <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <Table>
                <TableCaption>Data Stok Obat</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nomor Transaksi</TableHead>
                        <TableHead>Produk Di Beli</TableHead>
                        <TableHead>Metode Pembayaran</TableHead>
                        <TableHead>Bukti Pembayaran</TableHead>
                        <TableHead>Total Pembayaran</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTransaction.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                                {transaction.no_transaction}
                            </TableCell>
                            <TableCell className="font-medium">
                                {transaction.items_details.map((item) => (
                                    <div key={item.item_id}>
                                        {item.product_name}
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell className="font-medium">
                                {transaction.payment_method}
                            </TableCell>
                            <TableCell className="font-medium">
                                {transaction.payment_proof || "-"}
                            </TableCell>
                            <TableCell>
                                {formatCurrency(
                                    parseFloat(transaction.total_price)
                                )}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CashierSidebar>
    );
}
