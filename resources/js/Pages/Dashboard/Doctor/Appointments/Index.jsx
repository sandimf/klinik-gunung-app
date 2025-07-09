import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
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
import { ChevronDown, User, Calendar, Clock, MoreHorizontal } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { PatientDetails } from './Partials/PatientDetails';
import { StartAppointment } from './Partials/StartAppointment';

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

function AppointmentsDataTable({ data }) {
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
        header: "Tanggal Pengunjungan",
        cell: ({ row }) => formatTanggalIndo(row.original.appointment_date),
      },
      {
        accessorKey: "appointment_time",
        header: "Waktu",
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
      {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => (
          <Button size="sm" variant="outline" onClick={() => row.original.onViewPatient(row.original)}>
            <User className="mr-2 h-4 w-4" /> Detail
          </Button>
        ),
      },
    ],
    []
  );

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false);

  // Inject handler ke data
  const tableData = data.map(item => ({
    ...item,
    onViewPatient: (appointment) => {
      setSelectedAppointment(appointment);
      setIsPatientDetailsOpen(true);
    },
  }));

  const table = useReactTable({
    data: tableData,
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
      {selectedAppointment && (
        <PatientDetails
          patient={selectedAppointment.patient}
          isOpen={isPatientDetailsOpen}
          onClose={() => setIsPatientDetailsOpen(false)}
        />
      )}
    </div>
  );
}

export default function AppointmentsList({ appointments }) {
  return (
    <DoctorSidebar header={'Appointments'}>
      <Head title='Appointments' />
      <h2 className="text-2xl font-bold mb-4">Janji Mendatang</h2>
      <AppointmentsDataTable data={appointments} />
    </DoctorSidebar>
  );
}

