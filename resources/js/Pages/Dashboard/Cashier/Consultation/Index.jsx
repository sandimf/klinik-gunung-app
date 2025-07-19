import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import DataTable from "@/Components/DataTable/DataTable";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {  Printer } from "lucide-react";

const ScreeningIndex = ({
    screenings_offline = {},
    filters = {},
}) => {
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");
    const pagination = screenings_offline;

    useEffect(() => {
        setSearchTerm(filters.search || "");
    }, [filters.search]);

const labelMap = {
    konsultasi_dokter: "Konsultasi Dokter",
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
                            ? "Selesai"
                            : row.original.screening_status}
                </Badge>
            ),
        },
        {
                          accessorKey: "konsultasi_dokter",
                          header: "Layanan",
                          cell: ({ row }) =>
                              row.original.konsultasi_dokter === true || row.original.konsultasi_dokter === 1 || row.original.konsultasi_dokter === "1"
                                  ? labelMap.konsultasi_dokter
                                  : "-",
                      },
        {
            id: "aksi",
            header: "Aksi/Status",
            cell: ({ row }) => {
                if (row.original.screening_status === "pending") {
                    return (
                        <span className="text-yellow-600 font-semibold">
                            Sedang Diperiksa
                        </span>
                    );
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
                  <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600"
              >
                  Sedang Membayar
              </Badge>
                );
            },
        },
        {
            id: "pdf",
            header: "PDF",
            cell: ({ row }) =>
                row.original.screening_status === "completed" ? (
                    <Link
                        href={route(
                            "pdf.healthcheck.cashier",
                            row.original.uuid
                        )}
                    >
                        <Button>
                            <Printer />
                        </Button>
                    </Link>
                ) : (
                    <span>Belum Diperiksa</span>
                ),
        },
        {
            id: "nota",
            header: "Nota",
            cell: ({ row }) =>
                row.original.payment_status === "completed" ? (
                    <Link
                        href={route(
                            "generate.nota.ts",
                            row.original.payments?.[0]?.no_transaction
                        )}
                    >
                        <Button>
                            <Printer />
                        </Button>
                    </Link>
                ) : (
                    <span>Belum Dibayar</span>
                ),
        },
    ];

    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                { search: searchTerm },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleSearch = (searchValue) => {
        router.get(
            route("cashier.screening"),
            { search: searchValue, page: 1 },
            { preserveState: true, replace: true }
        );
    };
    return (
        <CashierSidebar header={"Pendampingan Medis"}>
            <Head title="Pendampingan Medis" />
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
                title="Pendampingan Medis"
                description="Daftar screening pasien dengan pendampingan"
            />
        </CashierSidebar>
    );
};

export default ScreeningIndex;
