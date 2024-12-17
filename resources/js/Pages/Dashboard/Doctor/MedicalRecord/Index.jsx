import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { MoreHorizontal, FileText } from 'lucide-react';
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Head } from "@inertiajs/react";
// Mock data for demonstration
const medicalRecords = [
  { id: 1, patientName: "John Doe", date: "2023-05-15", status: "Selesai" },
  { id: 2, patientName: "Jane Smith", date: "2023-05-14", status: "Diperlukan Tindak Lanjut" },
  { id: 3, patientName: "Alice Johnson", date: "2023-05-13", status: "Perawatan Berkelanjutan" },
  { id: 4, patientName: "Bob Williams", date: "2023-05-12", status: "Perawatan Berkelanjutan" },
  { id: 5, patientName: "Carol Brown", date: "2023-05-11", status: "Selesai" },
];

export default function MedicalRecordsList() {
  return (
    <DoctorSidebar header={'Medical Record'}>
        <Head title="Medical record" />
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Medical Records</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>Tanggal Pengunjungan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicalRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.patientName}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Lihat Detail</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit Record</DropdownMenuItem>
                    <DropdownMenuItem>Jadwalkan Tindak Lanjut</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </DoctorSidebar>
  );
}
