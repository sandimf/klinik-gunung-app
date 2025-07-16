import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

const DataTable = ({
    columns,
    data = [],
    pagination = null,
    onPageChange,
    searchValue = "",
    onSearchChange,
    onSearch,
    searchPlaceholder = "Search...",
    emptyState = "No data available",
    title = "",
    description = "",
    showSearch = true,
    showPagination = true,
}) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: !!pagination,
        pageCount: pagination?.last_page || 1,
        state: {
            pagination: {
                pageIndex: (pagination?.current_page || 1) - 1,
                pageSize: pagination?.per_page || 10,
            },
        },
    });

    const handleSearch = (e) => {
        e?.preventDefault();
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    return (
        <div className="space-y-4">
            {showSearch && (
                <div className="flex items-center justify-between">
                    <div>
                        {title && <h2 className="croll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">{title}</h2>}
                        {description && <p className="text-sm text-muted-foreground mb-6">{description}</p>}
                    </div>
                    <form onSubmit={handleSearch} className="flex items-center space-x-2">
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-[250px]"
                        />
                        <Button type="submit" variant="outline" size="sm">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
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
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
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
                                    {emptyState}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showPagination && pagination && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {pagination.from || 0} hingga {pagination.to || 0} dari{" "}
                        {pagination.total || 0} data
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(pagination.prev_page_url)}
                            disabled={!pagination.prev_page_url}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(pagination.next_page_url)}
                            disabled={!pagination.next_page_url}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add this line to ensure the component is exported as default
export default DataTable;