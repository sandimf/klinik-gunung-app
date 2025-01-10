import React,{useState} from 'react';
import Sidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Head } from '@inertiajs/react';
import { Toaster} from 'sonner';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import {FileDown,Search} from "lucide-react"


export default function Appointments({ appointments }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Sidebar header={'History Appointments'}>
      <Head title="History Appointments" />
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Riwayat Appointments</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
            <Search className="mr-2 h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search appointments..."
                className="pl-8 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
           
          </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tanggal Janji Temu</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patient.name}</TableCell>
                  <TableCell>{appointment.appointment_date}</TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    </Sidebar>
  );
}

