import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import CreateAppointmentModal from './Partials/CreateAppointmentModal';

export default function Appointments({ appointments }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const createAppointment = (newAppointment) => {
    setAppointments([
      ...appointments,
      { ...newAppointment, id: appointments.length + 1 }
    ]);
  };

  return (
    <Sidebar header={'Patient Dashboard'}>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">My Appointments</CardTitle>
        <Button onClick={() => setIsModalOpen(true)}>New Appointment</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.doctor}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  {appointment.status !== 'Cancelled' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => cancelAppointment(appointment.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CreateAppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateAppointment={createAppointment}
      />
    </Card>
    </Sidebar>
  );
}

