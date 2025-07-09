import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ChevronDown, Book, Pen, Printer } from "lucide-react";
import ScreeningDialog from "../_components/PhysicalExamination";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

const ScreeningHistoryIndex = ({ screenings = [] }) => {
    const { errors } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [examiningScreening, setExaminingScreening] = useState(null);

    const [globalFilter, setGlobalFilter] = useState("");

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
                cell: ({ row }) => (
                    <span className="font-bold">{row.original.name}</span>
                ),
            },
            {
                accessorKey: "jenis_screening",
                header: "Jenis Screening",
                cell: ({ row }) => (
                    <Badge variant={row.original.answers?.[0]?.isOnline === 1 ? "default" : "secondary"}>
                        {row.original.answers?.[0]?.isOnline === 1 ? "Screening Online" : "Screening Offline"}
                    </Badge>
                ),
            },
            {
                id: "status_pemeriksaan",
                header: "Status Pemeriksaan",
                cell: ({ row }) => (
                    <Badge>
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
                    <Badge>
                        {row.original.health_status === "Sehat"
                            ? "Sehat"
                            : row.original.health_status === "Tidak_sehat"
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
                        <Button variant="outline">
                            <Printer className="w-4 h-4" />
                        </Button>
                    </a>
                ),
            },
            {
                id: "kuesioner",
                header: "Kuesioner",
                cell: ({ row }) => (
                    <Link href={route("history.healthcheck", { uuid: row.original.uuid })}>
                        <Button variant="outline" className="mb-4">
                            <Book className="mr-2 w-4 h-4" /> Kuesioner
                        </Button>
                    </Link>
                ),
            },
            {
                id: "aksi",
                header: "Aksi",
                cell: ({ row }) => (
                    <Link href={route("edit.screening", { uuid: row.original.id })}>
                        <Button variant="outline" className="mb-4">
                            <Pen className="mr-2 w-4 h-4" /> Edit
                        </Button>
                    </Link>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: screenings,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <ParamedisSidebar header={"Riwayat Screening"}>
            <Head title="Riwayat Screening" />
            {/* Judul utama */}
            <h1 className="text-2xl font-bold mb-6">Riwayat Screening</h1>
            <p className="text-muted-foreground mb-6">Daftar seluruh hasil screening pasien yang telah dilakukan.</p>
            <div className="flex items-center py-4 gap-4">
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
            <ScreeningDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSuccess={() => {
                    setIsDialogOpen(false);
                    setExaminingScreening(null);
                }}
                examiningScreening={examiningScreening}
                errors={errors}
            />
        </ParamedisSidebar>
    );
};

export default ScreeningHistoryIndex;
