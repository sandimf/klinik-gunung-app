import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
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
import { ChevronDown, Book, Pen, Printer, Search } from "lucide-react";
import ScreeningDialog from "../_components/PhysicalExamination";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

const ScreeningHistoryIndex = ({ screenings = {}, filters = {} }) => {
    const { errors } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [examiningScreening, setExaminingScreening] = useState(null);
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");

    // Ambil data dari pagination backend
    const data = screenings.data || [];

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
                    <Badge variant={row.original.is_online === 1 ? "default" : "secondary"}>
                        {row.original.is_online === 1 ? "Screening Online" : "Screening Offline"}
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

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('paramedis.history'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Pagination handler
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, { search: searchTerm }, { preserveState: true, replace: true });
        }
    };

    return (
        <ParamedisSidebar header={"Riwayat Screening"}>
            <Head title="Riwayat Screening" />
            {/* Judul utama */}
            <h1 className="text-2xl font-bold mb-6">Riwayat Screening</h1>
            <p className="text-muted-foreground mb-6">Daftar seluruh hasil screening pasien yang telah dilakukan.</p>
            <div className="flex items-center py-4 gap-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Cari nama pasien..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button variant="ghost" type="submit">
                        <Search /> </Button>
                </form>
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
            {/* Pagination sederhana ala shadcn/ui */}
            {screenings && (
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-muted-foreground text-sm">
                        Page {screenings.current_page} of {screenings.last_page}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(screenings.prev_page_url)}
                            disabled={!screenings.prev_page_url}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(screenings.next_page_url)}
                            disabled={!screenings.next_page_url}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
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
