import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ChevronDown, Eye } from "lucide-react";
import { Button } from "@/Components/ui/button";
// import ScreeningDialog from "./Partials/PhysicalExamination"; // Dihapus
import { Badge } from "@/Components/ui/badge";

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

function ScreeningDataTable({ data, onHealthCheck }) {
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
        id: "tanggal_screening",
        header: "Tanggal Screening",
        cell: ({ row }) => formatTanggalIndo(row.original.created_at),
      },
      {
        accessorKey: "screening_status",
        header: "Status",
        cell: ({ row }) => (
          row.original.screening_status === "Completed" ? (
            <Badge>Selesai</Badge>
          ) : row.original.screening_status === "Pending" ? (
            <Badge>Belum Diperiksa</Badge>
          ) : (
            <span className="capitalize">{row.original.screening_status}</span>
          )
        ),
      },
      {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => (
          <Link href={route('doctor.screening.show', row.original.uuid)}>
            <Button size="sm">
              <Eye />
              Lihat Detail
            </Button>
          </Link>
        ),
      },
      // Kolom aksi bisa ditambahkan kembali jika diperlukan
    ],
    [onHealthCheck]
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

const ScreeningOfflineIndex = ({ screenings = [] }) => {
  const { errors } = usePage().props;
  // const [isDialogOpen, setIsDialogOpen] = useState(false); // Dihapus
  // const [examiningScreening, setExaminingScreening] = useState(null); // Dihapus
  // const handleExamine = (screening) => { setExaminingScreening(screening); setIsDialogOpen(true); }; // Dihapus
  // const handleDialogSuccess = () => { setIsDialogOpen(false); setExaminingScreening(null); }; // Dihapus
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredScreenings = screenings.filter(
    (screening) =>
      screening.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "all" || screening.type === selectedType)
  );

  const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);
  const paginatedScreenings = filteredScreenings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DoctorSidebar header={"Screening"}>
      <Head title="Screening" />

      {/* Judul utama */}
      <h1 className="text-2xl font-bold ">Screening</h1>

      <ScreeningDataTable data={paginatedScreenings} />
    </DoctorSidebar>
  );
};

export default ScreeningOfflineIndex;
