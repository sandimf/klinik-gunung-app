import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ChevronDown, Eye, Search } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

function PatientsDataTable({ data, searchTerm, setSearchTerm, handleSearch }) {
    const columns = React.useMemo(
        () => [
            {
                id: "no",
                header: "No.",
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: "name",
                header: "Nama Pasien",
            },
            {
                accessorKey: "date_of_birth",
                header: "Tanggal Lahir",
            },
            {
                accessorKey: "age",
                header: "Umur",
            },
            {
                accessorKey: "contact",
                header: "Nomor Telepon",
            },
            {
                accessorKey: "health_status",
                header: "Kesehatan",
                cell: ({ row }) => (
                    <Badge
                        variant={row.original.health_status === "Tidak_sehat" ? "destructive" : undefined}
                        className={row.original.health_status === "Tidak_sehat" ? "text-white" : ""}
                    >
                        {row.original.health_status === "Sehat"
                            ? "Sehat"
                            : row.original.health_status === "Tidak_sehat"
                                ? "Tidak Sehat"
                                : "Status Tidak Diketahui/Belum Diperiksa"}
                    </Badge>
                ),
            },
            {
                id: "aksi",
                header: "Aksi",
                cell: ({ row }) => (
                    <Link href={route('patients.doctor.show', row.original.uuid)}>
                        <Button size="sm">
                            <Eye />
                            Lihat Detail
                        </Button>
                    </Link>
                ),
            },
        ],
        []
    );

    const [globalFilter, setGlobalFilter] = React.useState("");
    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full">
            {/* Form search di atas dropdown column */}

            <div className="flex items-center py-4">
                <form onSubmit={handleSearch} className="flex gap-2 mb-2">
                    <Input
                        placeholder="Cari nama pasien..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button type="submit" variant="ghost"><Search /></Button>
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="ml-auto border rounded px-3 py-2 flex items-center text-sm">
                            Columns <ChevronDown className="ml-2 w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().map(column => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                checked={column.getIsVisible()}
                                onCheckedChange={value => column.toggleVisibility(!!value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Belum Ada Daftar Pasien.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

export default function PatientsList({ patients = {}, filters = {} }) {
    // Data dari Laravel paginator
    const data = patients?.data || [];
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");

    // Pagination handler
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, { search: searchTerm }, { preserveState: true, replace: true });
        }
    };

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('patients.doctor'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    return (
        <DoctorSidebar header={"Screening"}>
            <Head title="Screening" />
            <h1 className="text-2xl font-bold mb-6">Daftar Pasien</h1>
            <p className="text-muted-foreground mb-6">Berikut adalah daftar pasien yang telah melakukan screening di klinik.</p>
            <PatientsDataTable data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
            {/* Pagination sederhana ala shadcn/ui */}
            {patients && (
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-muted-foreground text-sm">
                        Page {patients.current_page} of {patients.last_page}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(patients.prev_page_url)}
                            disabled={!patients.prev_page_url}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(patients.next_page_url)}
                            disabled={!patients.next_page_url}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </DoctorSidebar>
    );
}
