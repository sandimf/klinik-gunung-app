import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/Components/ui/pagination";
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
import { Button } from '@/Components/ui/button';
import { CreditCard, Printer } from 'lucide-react';
import PaymentDialog from './Payments/OfflinePayments';
import { Link } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ScreeningIndex = ({
    screenings_offline = [],
    screenings_online = [],
    medicines,
    amounts = [],
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('offline');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [paymentScreening, setPaymentScreening] = useState(null);

    const itemsPerPage = 10;

    // Pilih data sesuai filter
    const screenings = filter === 'offline' ? screenings_offline : screenings_online;

    const filteredScreenings = screenings.filter(screening =>
        screening.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);
    const paginatedScreenings = filteredScreenings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePayment = (screening) => {
        setPaymentScreening(screening);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setPaymentScreening(null);
    };

    function ScreeningDataTable({ data, filter, onPayment }) {
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
                ...(filter === "online"
                    ? [
                        {
                            id: "pembayaran",
                            header: "Pembayaran",
                            cell: ({ row }) => (
                                <Link href={route('cashier.payments-online', row.original.id)}>
                                    <Button>
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Cek Pembayaran
                                    </Button>
                                </Link>
                            ),
                        },
                    ]
                    : [
                        {
                            id: "aksi",
                            header: "Aksi/Status",
                            cell: ({ row }) => {
                                if (row.original.screening_status === "Pending") {
                                    return <span className="text-yellow-600 font-semibold">Sedang Diperiksa</span>;
                                }
                                if (row.original.payment_status === "Completed") {
                                    return <span className="text-green-600 font-semibold">Dibayar</span>;
                                }
                                return (
                                    <Button onClick={() => onPayment(row.original)}>
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Bayar
                                    </Button>
                                );
                            },
                        },
                        {
                            id: "pdf",
                            header: "PDF",
                            cell: ({ row }) =>
                                row.original.screening_status === "Completed" ? (
                                    <a
                                        href={route("pdf.healthcheck.cashier", row.original.uuid)}
                                    >
                                        <Button>
                                            <Printer />
                                        </Button>
                                    </a>
                                ) : (
                                    <span>Belum Diperiksa</span>
                                ),
                        },
                    ]),
            ],
            [filter, onPayment]
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
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="offline">Offline</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                    </Select>
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
            </div>
        );
    }

    return (
        <CashierSidebar header={'Daftar Screening'}>
            <Head title="Screening" />
            <h2 className='text-2xl font-bold tracking-tight'>Screening</h2>
            <ScreeningDataTable data={paginatedScreenings} filter={filter} onPayment={handlePayment} />

            {filteredScreenings.length > 0 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(i + 1)}
                                    isActive={currentPage === i + 1}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <PaymentDialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                screening={paymentScreening}
                medicines={medicines}
                amounts={amounts}
            />
        </CashierSidebar>
    );
};

export default ScreeningIndex;
