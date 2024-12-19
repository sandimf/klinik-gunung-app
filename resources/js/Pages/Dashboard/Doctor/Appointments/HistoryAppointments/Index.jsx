import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import Sidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Head } from '@inertiajs/react';
import { Toaster} from 'sonner';

export default function Appointments({ appointments }) {

  return (
    <Sidebar header={'History Appointments'}>
      <Head title="History Appointments" />
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Janji Mendatang</h2>
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

