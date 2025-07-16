import React, { useState } from "react";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {Badge} from "@/Components/ui/badge";
import EditQuestionModal from "./Partials/Edit";
export default function Index({ questions }) {
    const { filters = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("questioner.index"),
            { search: searchTerm, page: 1 },
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

    const columns = React.useMemo(
        () => [
            {
                id: "no",
                header: "No",
                cell: ({ row }) => {
                    const currentPage = questions.current_page || 1;
                    const perPage = questions.per_page || 10;
                    return (currentPage - 1) * perPage + row.index + 1;
                },
            },
            {
                accessorKey: "question_text",
                header: "Pertanyaan",
                cell: ({ row }) => (
                    <div className="max-w-xs truncate">
                        {row.original.question_text}
                    </div>
                ),
            },
            {
                accessorKey: "answer_type",
                header: "Jenis Jawaban",
                cell: ({ row }) => (
                    <Badge variant="outline" className="capitalize">
                        {row.original.answer_type}
                    </Badge>
                ),
            },
            {
                accessorKey: "options",
                header: "Opsi",
                cell: ({ row }) => (
                    <div className="max-w-xs truncate">
                        {row.original.options?.length
                            ? row.original.options.join(", ")
                            : "-"}
                    </div>
                ),
            },
            {
                id: "actions",
                header: "Edit",
                cell: ({ row }) => (
                    <div className="space-x-2">
                        <EditQuestionModal question={row.original} />
                    </div>
                ),
            },
        ],
        [questions]
    );

    const table = useReactTable({
        data: questions.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <AdminSidebar header={"Daftar Kuesioner"}>
            <Head title="Daftar Kuesioner" />
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            Daftar Kuesioner
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1  mb-6">
                            Kelola daftar pertanyaan yang akan digunakan dalam
                            screening.
                        </p>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                    <Link href={route("questioner.create")}>
                        <Button className="space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Buat Baru</span>
                        </Button>
                    </Link>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            Tidak ada data ditemukan
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {questions && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {questions.from || 0} hingga{" "}
                                {questions.to || 0} dari {questions.total || 0}{" "}
                                data
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(questions.prev_page_url)
                                    }
                                    disabled={!questions.prev_page_url}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(questions.next_page_url)
                                    }
                                    disabled={!questions.next_page_url}
                                >
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    )}
            </AdminSidebar>
    );
}