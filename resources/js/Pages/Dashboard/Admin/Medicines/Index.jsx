import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminSidebar from '@/Layouts/Dashboard/AdminSidebarLayout';
import CreateMedicineDialog from './Partials/Create';
import EditMedicineDialog from './Partials/Edit';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/Components/ui/pagination";

export default function MedicineList({ medicines }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const handleDialogSuccess = () => {
        console.log('Obat berhasil ditambahkan!');
    };

    const filteredMedicines = medicines.data.filter((medicine) =>
        Object.values(medicine).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <AdminSidebar header="Medicine">
            <Head title="Obat" />
            <div className="flex flex-col h-full">
                <main className="flex-1 overflow-y-auto">
                    <Card className="m-6">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold">Obat</CardTitle>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Search medicines..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-sm"
                                />
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Obat
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Barcode</TableHead>
                                            <TableHead>Nama Obat</TableHead>
                                            <TableHead>Nama Brand</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Dosis</TableHead>
                                            <TableHead>Otc Price</TableHead>
                                            <TableHead>Harga Jual</TableHead>
                                            <TableHead>Stok</TableHead>
                                            <TableHead>Bach Number</TableHead>
                                            <TableHead>Tanggal Kadaluarsa</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMedicines.map((medicine) => (
                                            <TableRow key={medicine.id}>
                                                <TableCell className="font-medium">{medicine.barcode}</TableCell>
                                                <TableCell>{medicine.medicine_name}</TableCell>
                                                <TableCell>{medicine.brand_name}</TableCell>
                                                <TableCell>{medicine.category}</TableCell>
                                                <TableCell>{medicine.dosage}</TableCell>
                                                <TableCell>{formatCurrency(parseFloat(medicine.pricing.otc_price))}</TableCell>
                                                <TableCell>{formatCurrency(parseFloat(medicine.pricing.purchase_price))}</TableCell>
                                                <TableCell>{medicine.batches.length > 0 ? medicine.batches[0].quantity : '-'}</TableCell>
                                                <TableCell>{medicine.batches.length > 0 ? medicine.batches[0].batch_number : '-'}</TableCell>
                                                <TableCell>{medicine.batches.length > 0 ? formatDate(medicine.batches[0].expiration_date) : '-'}</TableCell>
                                                <TableCell>{medicine.supplier}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <EditMedicineDialog medicine={medicine} onSuccess={() => {/* Refresh data if needed */}} />
                                                        <Button variant="outline" size="icon">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </main>

                <div className="flex items-center justify-between px-2 py-4">
                    <Pagination>
                        <PaginationContent>
                            {medicines.links.map((link, index) => {
                                if (link.url === null) return null;
                                if (index === 0) {
                                    return (
                                        <PaginationItem key={index}>
                                            <Link href={link.url}>
                                                <PaginationPrevious />
                                            </Link>
                                        </PaginationItem>
                                    );
                                }
                                if (index === medicines.links.length - 1) {
                                    return (
                                        <PaginationItem key={index}>
                                            <Link href={link.url}>
                                                <PaginationNext />
                                            </Link>
                                        </PaginationItem>
                                    );
                                }
                                return (
                                    <PaginationItem key={index}>
                                        <Link href={link.url}>
                                            <PaginationLink isActive={link.active}>
                                                {link.label}
                                            </PaginationLink>
                                        </Link>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            <CreateMedicineDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSuccess={handleDialogSuccess}
            />
        </AdminSidebar>
    );
}
