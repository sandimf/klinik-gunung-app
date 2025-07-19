import DataTable from "@/Components/DataTable/DataTable";
import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";

export default function TransactionHistory({ transactions, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");

    const handleSearch = (searchValue) => {
        router.get(
            route("cashier.transaction.history"),
            { search: searchValue, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, { search: searchTerm }, { preserveState: true, replace: true });
        }
    };

    const columns = [
        {
            id: "no",
            header: "No.",
            cell: ({ row }) => {
                const currentPage = transactions?.current_page || 1;
                const perPage = transactions?.per_page || 10;
                return (currentPage - 1) * perPage + row.index + 1;
            },
        },
        {
            accessorKey: "no_transaction",
            header: "No Transaksi",
        },
        {
            accessorKey: "patient_name",
            header: "Nama Pasien",
            cell: ({ row }) => row.original.patient_name || "-",
        },
        {
            id: "produk_obat",
            header: "Produk/Obat",
            cell: ({ row }) => (
                <div>
                    {row.original.items_details.map((item) => (
                        <div key={item.item_id}>
                            {item.item_type === "medicine" && item.medicine_name && (
                                <span>Obat: {item.medicine_name} x {item.quantity}</span>
                            )}
                            {item.item_type === "other" && item.product_name && (
                                <span>Produk: {item.product_name} x {item.quantity}</span>
                            )}
                            {!item.item_type && item.product_name && (
                                <span>Produk: {item.product_name} x {item.quantity}</span>
                            )}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "payment_method",
            header: "Metode Pembayaran",
        },
        {
            id: "bukti_pembayaran",
            header: "Bukti Pembayaran",
            cell: ({ row }) =>
                row.original.payment_proof ? (
                    <a
                        href={`/storage/${row.original.payment_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Lihat Bukti
                    </a>
                ) : (
                    "-"
                ),
        },
        {
            accessorKey: "total_price",
            header: "Total Pembayaran",
            cell: ({ row }) =>
                new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                }).format(row.original.total_price),
        },
    ];

    return (
        <CashierSidebar header="Riwayat Transaksi">
            <Head title="Riwayat Transaksi" />
            <DataTable
                columns={columns}
                data={transactions.data || []}
                pagination={transactions}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
                onPageChange={handlePageChange}
                searchPlaceholder="Cari pasien, produk, atau obat..."
                emptyState="Belum ada transaksi"
                title="Riwayat Transaksi"
                description="Daftar seluruh transaksi produk dan obat."
            />
        </CashierSidebar>
    );
}
