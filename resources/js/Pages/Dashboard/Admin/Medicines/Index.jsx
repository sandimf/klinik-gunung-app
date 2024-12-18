import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminSidebar from '@/Layouts/Dashboard/AdminSidebarLayout';
import CreateMedicineDialog from './Partials/Create';
import EditMedicineDialog from './Partials/Edit';
import { Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableCaption
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import MedicineHeader from './_components/table-header';

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
            
            <MedicineHeader
                onAddMedicineClick={() => setIsDialogOpen(true)}  // Handler untuk membuka dialog
            />
            <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

            <Table>
            <TableCaption>Medicine List</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Barcode</TableHead>
                        <TableHead>Nama Obat</TableHead>
                        <TableHead>Nama Brand</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Bach Number</TableHead>
                        <TableHead>Tanggal Kadaluarsa</TableHead>
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
                            {/* <TableCell>{medicine.dosage}</TableCell> */}
                            {/* <TableCell>{formatCurrency(parseFloat(medicine.pricing.otc_price))}</TableCell> */}
                            {/* <TableCell>{formatCurrency(parseFloat(medicine.pricing.purchase_price))}</TableCell> */}
                            <TableCell>{medicine.batches.length > 0 ? medicine.batches[0].quantity : '-'}</TableCell>
                            <TableCell>{medicine.batches.length > 0 ? medicine.batches[0].batch_number : '-'}</TableCell>
                            <TableCell>{medicine.batches.length > 0 ? formatDate(medicine.batches[0].expiration_date) : '-'}</TableCell>
                            <TableCell>{medicine.supplier}</TableCell>
                            <TableCell>
                                <EditMedicineDialog medicine={medicine} onSuccess={() => {/* Refresh data if needed */ }} />
                                <Button variant="outline" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <CreateMedicineDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSuccess={handleDialogSuccess}
            />
        </AdminSidebar>
    );
}
