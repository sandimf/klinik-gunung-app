import DataTable from "@/Components/DataTable/DataTable";
import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Button } from "@/Components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { ScrollArea } from "@/Components/ui/scroll-area";
import ProductHeader from "./_components/table-header";

export default function Product({ products, filters = {} }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");

    // Edit form state
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: "",
        stock: "",
        price: "",
    });

    useEffect(() => {
        if (editProduct) {
            setData({
                name: editProduct.name,
                stock: editProduct.stock,
                price: editProduct.price,
            });
        } else {
            reset();
        }
    }, [editProduct]);

    const handleEdit = (product) => {
        setEditProduct(product);
        setEditDialogOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        patch(route("product.update.cashier", { id: editProduct.id }), {
            onSuccess: () => {
                setEditDialogOpen(false);
                setEditProduct(null);
            },
        });
    };

    const handleDelete = (product) => {
        if (window.confirm(`Yakin ingin menghapus produk '${product.name}'?`)) {
            router.delete(route("product.destroy.cashier", { id: product.id }), {
                onSuccess: () => { },
            });
        }
    };

    const handleSearch = (searchValue) => {
        router.get(
            route("product.cashier"),
            { search: searchValue, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, { search: searchTerm }, { preserveState: true, replace: true });
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    const columns = [
        {
            id: "no",
            header: "No.",
            cell: ({ row }) => {
                const currentPage = products?.current_page || 1;
                const perPage = products?.per_page || 10;
                return (currentPage - 1) * perPage + row.index + 1;
            },
        },
        {
            accessorKey: "name",
            header: "Nama Produk",
        },
        {
            accessorKey: "stock",
            header: "Stok",
        },
        {
            accessorKey: "price",
            header: "Harga",
            cell: ({ row }) => formatCurrency(parseFloat(row.original.price)),
        },
        {
            id: "aksi",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <CashierSidebar header="Produk">
            <Head title="Produk" />
            <ProductHeader onAddProductClick={() => setIsDialogOpen(true)} />
            <DataTable
                columns={columns}
                data={products.data || []}
                pagination={products}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
                onPageChange={handlePageChange}
                searchPlaceholder="Cari produk..."
                emptyState="Belum ada produk"
                title="Daftar Produk"
                description="Manajemen produk klinik."
            />
            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Produk</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-grow">
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nama Produk</Label>
                                    <input
                                        id="edit-name"
                                        className="input"
                                        value={data.name}
                                        onChange={e => setData("name", e.target.value)}
                                        placeholder="Masukkan Nama Produk"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-stock">Stock</Label>
                                    <input
                                        id="edit-stock"
                                        className="input"
                                        value={data.stock}
                                        onChange={e => setData("stock", e.target.value)}
                                        placeholder="Masukkan Stock"
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-red-500">{errors.stock}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-price">Harga</Label>
                                    <input
                                        id="edit-price"
                                        className="input"
                                        value={data.price}
                                        onChange={e => setData("price", e.target.value)}
                                        placeholder="Masukkan Harga"
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-red-500">{errors.price}</p>
                                    )}
                                </div>
                            </div>
                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </CashierSidebar>
    );
}
