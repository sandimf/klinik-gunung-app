import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Printer, Book, Pen, RefreshCcw } from "lucide-react";
import ScreeningDialog from "../_components/PhysicalExamination";
import DataTable from "@/Components/DataTable/DataTable";

const ScreeningHistoryIndex = ({ screenings_offline = {}, filters = {} }) => {
    const { errors } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");

    console.log(screenings_offline);
    const handleSearch = (searchValue) => {
        router.get(
            route("paramedis.history"),
            { search: searchValue },
            { preserveState: true, replace: true }
        );
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                { search: searchTerm },
                { preserveState: true, replace: true }
            );
        }
    };




    const columns = [
        {
            id: "no",
            header: "No.",
            cell: ({ row }) => {
                const currentPage = screenings_offline?.current_page || 1;
                const perPage = screenings_offline?.per_page || 10;
                return (currentPage - 1) * perPage + row.index + 1;
            },
        },
        {
            accessorKey: "name",
            header: "Nama Pasien",
            cell: ({ row }) => <span className="font-bold">{row.original.name}</span>,
        },
        {
            id: "status_pemeriksaan",
            header: "Status Pemeriksaan",
            cell: ({ row }) => (
                <Badge
                    className={
                        row.original.screening_status === "completed"
                            ? "bg-blue-500 text-white dark:bg-blue-600"
                            : "bg-gray-500 text-white dark:bg-gray-600"
                    }
                >
                    {row.original.screening_status === "completed"
                        ? "Selesai"
                        : row.original.screening_status}
                </Badge>
            ),
        },
        {
            id: "status_kesehatan",
            header: "Status Kesehatan",
            cell: ({ row }) => (
                <Badge
                    className={
                        row.original.health_status === "sehat"
                            ? "bg-blue-500 text-white dark:bg-blue-600"
                            : row.original.health_status === "tidak_sehat"
                                ? "bg-red-500 text-white dark:bg-red-600"
                                : "bg-gray-500 text-white dark:bg-gray-600"
                    }
                >
                    {row.original.health_status === "sehat"
                        ? "Sehat"
                        : row.original.health_status === "tidak_sehat"
                            ? "Tidak Sehat"
                            : "Status Tidak Diketahui"}
                </Badge>
            ),
        },
        {
            id: "sertifikat",
            header: "Sertifikat",
            cell: ({ row }) => (
                <a href={route("pdf.healthcheck.paramedis", row.original.uuid)}>
                    <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4" />
                    </Button>
                </a>
            ),
        },
        {
            id: "kuesioner",
            header: "Kuesioner",
            cell: ({ row }) => (
                <Link
                    href={route("history.healthcheck", {
                        uuid: row.original.uuid,
                    })}
                >
                    <Button variant="outline" size="sm">
                        <Book className="mr-2 w-4 h-4" /> Kuesioner
                    </Button>
                </Link>
            ),
        },
        {
            id: "aksi",
            header: "Aksi",
            cell: ({ row }) => (
                <Link
                    href={route("edit.screening", {
                        uuid: row.original.id,
                    })}
                >
                    <Button variant="outline" size="sm">
                        <Pen className="mr-2 w-4 h-4" /> Edit
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <ParamedisSidebar header="Riwayat Screening">
            <Head title="Riwayat Screening" />

            <DataTable
                columns={columns}
                data={screenings_offline?.data || []}
                pagination={screenings_offline}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
                onPageChange={handlePageChange}
                searchPlaceholder="Cari nama pasien..."
                emptyState="Belum ada data"
                title="Riwayat Screening"
                description="Semua screening yang sudah selesai dilakukan"
            />

        </ParamedisSidebar>
    );
};

export default ScreeningHistoryIndex;
