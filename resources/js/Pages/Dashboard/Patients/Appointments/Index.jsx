import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import CreateAppointmentModal from './Partials/CreateAppointmentModal';
import CancelAppointmentModal from './Partials/CancelAppointmentModal';
import { Head, useForm } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { CheckCircle2, X } from 'lucide-react';

export default function Appointments({ appointments: initialAppointments }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const { put, processing } = useForm();

  const createAppointment = (newAppointment) => {
    // Implement your create appointment logic here
    setAppointments([
      ...appointments,
      { ...newAppointment, id: appointments.length + 1 }
    ]);
    setIsCreateModalOpen(false);
  };

  const openCancelModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsCancelModalOpen(true);
  };

  const cancelAppointment = (appointmentId) => {
    put(route('appointments.update', appointmentId), {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Appointment cancelled successfully!', {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          duration: 3000,
        });
        setIsCancelModalOpen(false);
        // Update the local state to reflect the cancellation
        setAppointments(appointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'cancelled' } 
            : appointment
        ));
      },
      onError: (errors) => {
        toast.error('Failed to cancel appointment. Please try again.', {
          icon: <X className="h-5 w-5 text-red-500" />,
          duration: 3000,
        });
      },
    });
  };

  return (
    <Sidebar header={'Patient Dashboard'}>
      <Head title="Appointments" />
      <Toaster position="top-center" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">My Appointments</CardTitle>
          <Button onClick={() => setIsCreateModalOpen(true)}>New Appointment</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patient.name}</TableCell>
                  <TableCell>{appointment.appointment_date}</TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => openCancelModal(appointment.id)}
                      disabled={processing}
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
      </Card>
      
      <CreateAppointmentModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAppointment={createAppointment}
      />

      <CancelAppointmentModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => cancelAppointment(selectedAppointmentId)}
        appointmentId={selectedAppointmentId}
      />
    </Sidebar>
  );
}

