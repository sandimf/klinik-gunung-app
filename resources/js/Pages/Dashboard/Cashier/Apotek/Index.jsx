import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import CashierSidebar from '@/Layouts/Dashboard/CashierSidebarLayout';
import CreateMedicineDialog from './Partials/Create';
import EditMedicineDialog from './Partials/Edit';
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
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/Components/ui/button";

function formatDate(dateString) {
    if (!dateString) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function MedicineDataTable({ data }) {
    const columns = React.useMemo(
        () => [
            { id: "no", header: "No.", cell: ({ row }) => row.index + 1 },
            { accessorKey: "barcode", header: "Barcode" },
            { accessorKey: "medicine_name", header: "Nama Obat" },
            { accessorKey: "brand_name", header: "Nama Brand" },
            { accessorKey: "category", header: "Kategori" },
            { accessorKey: "dosage", header: "Dosis" },
            {
                id: "stok",
                header: "Stok",
                cell: ({ row }) => row.original.batches.length > 0 ? row.original.batches[0].quantity : '-',
            },
            {
                id: "batch_number",
                header: "Batch Number",
                cell: ({ row }) => row.original.batches.length > 0 ? row.original.batches[0].batch_number : '-',
            },
            {
                id: "expiration_date",
                header: "Tanggal Kadaluarsa",
                cell: ({ row }) => row.original.batches.length > 0 ? formatDate(row.original.batches[0].expiration_date) : '-',
            },
            { accessorKey: "supplier", header: "Supplier" },
            {
                id: "aksi",
                header: "Aksi",
                cell: ({ row }) => <EditMedicineDialog medicine={row.original} onSuccess={() => { }} />,
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
            <div className="flex items-center py-4">
                <Input
                    placeholder="Cari Obat ..."
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

export default function MedicineList({ medicines }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <CashierSidebar header="Obat">
            <Head title="Obat" />
            <MedicineHeader onAddMedicineClick={() => setIsDialogOpen(true)} />
            <MedicineDataTable data={medicines.data} />
            <CreateMedicineDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSuccess={() => { }}
            />
        </CashierSidebar>
    );
}
