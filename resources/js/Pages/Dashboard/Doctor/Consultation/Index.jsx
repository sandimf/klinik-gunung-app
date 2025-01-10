import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {Link} from "@inertiajs/react"

import { Button } from "@/Components/ui/button";
import {  FileDown, Plus } from 'lucide-react';
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Head } from '@inertiajs/react';

export default function Consultation({ patients }) {
  return (
    <DoctorSidebar header={'konsultasi'}>
      <Head title='Konsultasi' />
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Daftar Konsultasi</h2>
          <div className="flex items-center space-x-4">
            
            <Link href={route('consultasi.create')}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Buat Konsultasi
            </Button>
            </Link>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Pasien</TableHead>
              <TableHead>Tanggal Pengunjungan</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {patients.map((patient, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell className="text-right">
                  {/* <Link href={route('consultasi.show', patient.id)}>
                    <Button variant="outline">Detail</Button>
                  </Link> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DoctorSidebar>
  );
}

