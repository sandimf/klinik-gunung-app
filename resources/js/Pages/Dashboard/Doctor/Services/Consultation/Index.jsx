import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ChevronDown, Eye, Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Head, router } from "@inertiajs/react";
import SideBar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Link } from "@inertiajs/inertia-react";

function ConsultationDataTable({ data, searchTerm, setSearchTerm, handleSearch }) {
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
        accessorKey: "nik",
        header: "NIK",
      },
      {
        accessorKey: "date_of_birth",
        header: "Tanggal Lahir",
      },
      {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => (
          <Link href={route('consultation.show', row.original.uuid)}>
            <Button size="sm">
              <Eye />
              Lihat Detail
            </Button>
          </Link>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: () => "-",
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
      <div className="flex items-center py-4 gap-2">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Cari Nama atau NIK"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="ghost"><Search /></Button>
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
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ConsultationIndex({ patients = {}, filters = {} }) {
  const data = patients.data || [];
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
    router.get(route('consultation.index'), { search: searchTerm }, { preserveState: true, replace: true });
  };

  return (
    <SideBar header={`Konsultasi Dokter`}>
      <Head title="Konsultasi Dokter" />
      <h1 className="text-2xl font-bold mb-6">Konsultasi</h1>
      <ConsultationDataTable
        data={data}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      {/* Pagination */}
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
    </SideBar>
  );
}
