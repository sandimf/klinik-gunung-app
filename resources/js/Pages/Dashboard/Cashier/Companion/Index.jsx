import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

const labelMap = {
    Pendampingan_perawat: "Pendampingan Perawat",
    Pendampingan_paramedis: "Pendampingan Paramedis",
    Pendampingan_dokter: "Pendampingan Dokter"
};

function CompanionDataTable({ data }) {
    const columns = useMemo(
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
                accessorKey: "pendampingan",
                header: "Pendampingan",
                cell: ({ row }) => labelMap[row.original.pendampingan] || "-",
            },
        ],
        []
    );

    const [globalFilter, setGlobalFilter] = useState("");
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
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Cari nama pasien..."
                    value={globalFilter ?? ""}
                    onChange={e => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
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
                                    Belum ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

const ScreeningOfflineIndex = ({ screenings = [], medicines, amounts = [], flash = {} }) => {
    return (
        <CashierSidebar header={'Daftar pendamping'}>
            <Head title="pendamping" />
            <Toaster position='top-center' />
            <h2 className="text-2xl font-bold mb-4">Pendampingan Medis</h2>
            <CompanionDataTable data={screenings} />
        </CashierSidebar>
    );
};

export default ScreeningOfflineIndex;
