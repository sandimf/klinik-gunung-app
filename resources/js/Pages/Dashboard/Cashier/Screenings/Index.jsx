import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import DataTable from "@/Components/DataTable/DataTable";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { CreditCard, Printer } from "lucide-react";
import PaymentDialog from "./Payments/OfflinePayments";
import { toast } from "sonner";

const ScreeningIndex = ({
    screenings_offline = {},
    medicines,
    amounts = [],
    filters = {},
    products = [], // Tambahkan props products
}) => {
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [paymentScreening, setPaymentScreening] = useState(null);
    const { errors, flash } = usePage().props;
    const pagination = screenings_offline;
    const [shouldReload, setShouldReload] = useState(false);

    useEffect(() => {
        setSearchTerm(filters.search || "");
    }, [filters.search]);

    useEffect(() => {
        if (shouldReload) {
            router.reload({ only: ["screenings_offline"] });
            setShouldReload(false);
        }
    }, [shouldReload]);

    useEffect(() => {
        if (errors && errors.payment) {
            toast.error(errors.payment);
        }
    }, [errors]);

    const handleOpenPayment = (screening) => {
        setPaymentScreening(screening);
        setIsDialogOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsDialogOpen(false);
        setPaymentScreening(null);
        setShouldReload(true);
        // Tambahkan toast notification
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setPaymentScreening(null);
    };


    const columns = [
        {
            id: "no",
            header: "No.",
            cell: ({ row }) => {
                const currentPage = pagination?.current_page || 1;
                const perPage = pagination?.per_page || 10;
                return (currentPage - 1) * perPage + row.index + 1;
            },
        },
        {
            accessorKey: "name",
            header: "Nama Pasien",
        },
        {
            id: "status_pemeriksaan",
            header: "Status Pemeriksaan",
            cell: ({ row }) => (
                <Badge
                    className={
                        row.original.screening_status === "completed"
                            ? "bg-blue-500 text-white dark:bg-blue-600"
                            : row.original.screening_status === "pending"
                                ? "bg-yellow-500 text-white dark:bg-yellow-600"
                                : "bg-gray-500 text-white dark:bg-gray-600"
                    }
                >
                    {row.original.screening_status === "pending"
                        ? "Belum Diperiksa"
                        : row.original.screening_status === "completed"
                            ? "Selesai Diperiksa"
                            : row.original.screening_status}
                </Badge>
            ),
        },
        {
            id: "aksi",
            header: "Aksi / Pembayaran",
            cell: ({ row }) => {
                if (row.original.screening_status === "pending") {
                    return <span>Pemeriksaan Belum Dilakukan</span>;
                }

                if (row.original.payment_status === "completed") {
                    return (
                        <Badge
                            variant="secondary"
                            className="bg-blue-500 text-white dark:bg-blue-600"
                        >
                            Sudah Membayar
                        </Badge>
                    );
                }

                return (
                    <Button
                        onClick={() => handleOpenPayment(row.original)}
                        variant="ghost"
                    >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Bayar Sekarang
                    </Button>
                );
            },
        },
        {
            id: "pdf",
            header: "Cetak PDF",
            cell: ({ row }) =>
                row.original.screening_status === "completed" ? (
                    <a
                        href={route(
                            "pdf.healthcheck.cashier",
                            row.original.uuid
                        )}
                    >
                        <Button>
                            <Printer />
                        </Button>
                    </a>
                ) : (
                    <span>Pemeriksaan Belum Selesai</span>
                ),
        },
        {
            id: "nota",
            header: "Nota Pembayaran",
            cell: ({ row }) =>
                row.original.payment_status === "completed" ? (
                    <a
                        href={route(
                            "generate.nota.ts",
                            row.original.payments?.[0]?.no_transaction
                        )}
                    >
                        <Button>
                            <Printer />
                        </Button>
                    </a>
                ) : (
                    <span>Menunggu Pembayaran</span>
                ),
        },
    ];

    // Pagination handler
    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                { search: searchTerm },
                { preserveState: true, replace: true }
            );
        }
    };

    // Search handler
    const handleSearch = (searchValue) => {
        router.get(
            route("cashier.screening"),
            { search: searchValue, page: 1 },
            { preserveState: true, replace: true }
        );
    };
    return (
        <CashierSidebar header={"Daftar Pembayaran Screening"}>
            <Head title="Screening" />
            <DataTable
                columns={columns}
                data={screenings_offline?.data || []}
                pagination={screenings_offline}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                searchPlaceholder="Cari nama pasien..."
                emptyState="Belum ada data"
                title="Daftar Screening"
                description="Daftar screening pasien yang telah membayar dan belum"
            />
            {isDialogOpen && paymentScreening && (
                <PaymentDialog
                    isOpen={isDialogOpen}
                    setIsOpen={handleCloseDialog} // Gunakan function yang sudah dibuat
                    onPaymentSuccess={handlePaymentSuccess}
                    onSuccess={handlePaymentSuccess} // Pastikan kedua callback terhubung
                    screening={paymentScreening}
                    medicines={medicines}
                    amounts={amounts}
                    products={products} // Tambahkan ini
                />
            )}


        </CashierSidebar>
    );
};

export default ScreeningIndex;
