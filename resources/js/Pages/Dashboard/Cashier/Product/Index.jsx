import { useState } from "react";
import { Head } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Toaster } from "sonner";
import useFlashToast from "@/hooks/flash";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableCaption,
} from "@/Components/ui/table";
import ProductHeader from "./_components/table-header";
import CreateMedicineDialog from "./Create";
import { Edit } from "lucide-react";

export default function Product({ products }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredProduct = products.data.filter((product) =>
        Object.values(product).some((value) =>
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
            <ProductHeader onAddProductClick={() => setIsDialogOpen(true)} />
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
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProduct.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">
                                {product.name}
                            </TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                                {formatCurrency(parseFloat(product.price))}
                            </TableCell>
                            <TableCell>
                                <Button>
                                    <Edit />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <CreateMedicineDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
            />
        </CashierSidebar>
    );
}
