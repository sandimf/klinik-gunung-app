import DataTable from "@/Components/DataTable/DataTable";
import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Button } from "@/Components/ui/button";
import { Stethoscope, Book } from "lucide-react";
import ScreeningDialog from "./_components/PhysicalExamination";
import { Badge } from "@/Components/ui/badge";
import { RefreshCcw } from "lucide-react";

const ScreeningOfflineIndex = ({ screenings_offline, filters = {} }) => {
    const { errors, flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [examiningScreening, setExaminingScreening] = useState(null);

    const handleExamine = (screening) => {
        setExaminingScreening(screening);
        setIsDialogOpen(true);
    };

    const handleDialogSuccess = () => {
        setIsDialogOpen(false);
        setExaminingScreening(null);
        router.reload({ only: ['screenings_offline'] });
    };

const handleSearch = (searchValue) => {
    router.get(
        route("paramedis.screenings"),
        { search: searchValue, page: 1 },
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

    const handleManualRefresh = () => {
        router.reload({ only: ['screenings_offline'] });
    };

    const formatLastUpdate = () => {
        return new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(new Date());
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
        },
        {
            accessorKey: "jenis_screening",
            header: "Jenis Screening",
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.answers?.[0]?.isOnline === 1
                            ? "default"
                            : "secondary" 
                    }
                >
                    {row.original.answers?.[0]?.isOnline === 1
                        ? "Screening Online"
                        : "Screening Offline"}
                </Badge>
            ),
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
            id: "kuesioner",
            header: "Kuesioner",
            cell: ({ row }) => (
                <Link
                    href={route("paramedis.detail", {
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
                <div className="flex space-x-2">
                    {row.original.screening_status !== "completed" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExamine(row.original)}
                        >
                            <Stethoscope className="mr-2 w-4 h-4" /> Pemeriksaan
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <ParamedisSidebar header="Screening">
            <Head title="Daftar Screening" />
            

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
                title="Daftar Screening"
                description="Daftar screening pasien yang belum diperiksa"
            />
            
        <div className="flex justify-start items-center gap-4 mt-8">
                <Button
                variant="ghost"
                size="sm"
                onClick={handleManualRefresh}
            >
                <RefreshCcw/>
            </Button>
            <span className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                Terakhir diperbarui: {formatLastUpdate()}
            </span>

        </div>

            <ScreeningDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSuccess={handleDialogSuccess}
                examiningScreening={examiningScreening}
                errors={errors}
            />
        </ParamedisSidebar>
    );
};

export default ScreeningOfflineIndex;