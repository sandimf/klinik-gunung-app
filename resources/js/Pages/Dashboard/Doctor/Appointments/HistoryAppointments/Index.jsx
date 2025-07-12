import React, { useState } from 'react';
import Sidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Head } from '@inertiajs/react';
import { Toaster } from 'sonner';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

function formatTanggalIndo(dateString) {
  if (!dateString) return "-";
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const d = new Date(dateString);
  if (isNaN(d)) return "-";
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function HistoryAppointmentsDataTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "patient.name",
        header: "Nama Pasien",
        cell: ({ row }) => row.original.patient?.name || "-",
      },
      {
        accessorKey: "appointment_date",
        header: "Tanggal Janji Temu",
        cell: ({ row }) => formatTanggalIndo(row.original.appointment_date),
      },
      {
        accessorKey: "appointment_time",
        header: "Jam",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let color = "";
          let label = status;
          if (status === "confirmed") { color = "bg-green-100 text-green-800"; label = "Terkonfirmasi"; }
          else if (status === "pending") { color = "bg-yellow-100 text-yellow-800"; label = "Menunggu"; }
          else if (status === "cancelled") { color = "bg-red-100 text-red-800"; label = "Dibatalkan"; }
          else if (status === "completed") { color = "bg-blue-100 text-blue-800"; label = "Selesai"; }
          return <Badge className={color}>{label}</Badge>;
        },
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

export default function Appointments({ appointments }) {
  return (
    <Sidebar header={'Riwayat Janji Mendatang'}>
      <Head title="Riwayat janji Mendatang" />
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-4">Riwayat Janji Mendatang</h2>
      <HistoryAppointmentsDataTable data={appointments} />
    </Sidebar>
  );
}

