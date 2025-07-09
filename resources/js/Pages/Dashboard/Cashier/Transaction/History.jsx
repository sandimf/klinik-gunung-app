import { useState } from "react";
import { Head } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

export default function Product({ transactions }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

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

    return (
        <CashierSidebar header="Produk">
            <Head title="Produk" />
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
                        <TableHead>No</TableHead>
                        <TableHead>Nomor Transaksi</TableHead>
                        <TableHead>Produk Di Beli</TableHead>
                        <TableHead>Metode Pembayaran</TableHead>
                        <TableHead>Bukti Pembayaran</TableHead>
                        <TableHead>Total Pembayaran</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTransaction.map((transaction, idx) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{idx + 1}</TableCell>
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
                                {transaction.payment_proof ? (
                                    <button
                                        className="text-blue-600 underline"
                                        onClick={() => {
                                            setPreviewImage(transaction.payment_proof);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        Lihat Bukti
                                    </button>
                                ) : (
                                    "-"
                                )}
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

            {/* Dialog Preview Bukti Pembayaran */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bukti Pembayaran</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4">
                        {previewImage && (
                            <>
                                <img
                                    src={`/storage/${previewImage}`}
                                    alt="Bukti Pembayaran"
                                    className="max-w-full max-h-[60vh] rounded"
                                />
                                <a
                                    href={`/storage/${previewImage}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline">
                                        Download Bukti Pembayaran
                                    </Button>
                                </a>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setOpenDialog(false)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CashierSidebar>
    );
}
