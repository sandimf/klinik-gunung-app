import React, { useState } from 'react';
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
import { MoreHorizontal, Calendar, Clock, User, Search, FileDown } from 'lucide-react';
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Head } from '@inertiajs/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Input } from "@/Components/ui/input";
import { PatientDetails } from './Partials/PatientDetails';
// import { RescheduleAppointment } from './Partials/RescheduleAppointment';
import { StartAppointment } from './Partials/StartAppointment';

export default function AppointmentsList({appointments}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isStartAppointmentOpen, setIsStartAppointmentOpen] = useState(false);

  const filteredAppointments = appointments.filter(appointment =>
    (statusFilter === 'all' || appointment.status === statusFilter) &&
    (appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     appointment.appointment_date.includes(searchTerm) ||
     appointment.appointment_time.includes(searchTerm))
  );

  const handleExportPDF = () => {
    // Placeholder for PDF export functionality
    console.log('Exporting to PDF...');
  };

  const handleViewPatientDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsPatientDetailsOpen(true);
  };

  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleOpen(true);
  };

  const handleStartAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsStartAppointmentOpen(true);
  };

  const onReschedule = (appointmentId, newDate, newTime) => {
    // Placeholder for rescheduling logic
    console.log(`Rescheduling appointment ${appointmentId} to ${newDate} at ${newTime}`);
  };

  const onStartAppointment = (appointmentId) => {
    // Placeholder for starting appointment logic
    console.log(`Starting appointment ${appointmentId}`);
  };

  return (
    <DoctorSidebar header={'Appointments'}>
      <Head title='Appointments' />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Janji Mendatang</h2>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
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
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.patient.name}</TableCell>
                <TableCell>{appointment.appointment_date}</TableCell>
                <TableCell>{appointment.appointment_time}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewPatientDetails(appointment)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>View Patient Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRescheduleAppointment(appointment)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Reschedule Appointment</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStartAppointment(appointment)}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Start Appointment</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedAppointment && (
        <>
          <PatientDetails
            patient={selectedAppointment.patient}
            isOpen={isPatientDetailsOpen}
            onClose={() => setIsPatientDetailsOpen(false)}
          />
          {/* <RescheduleAppointment
            appointmentId={selectedAppointment.id}
            currentDate={new Date(selectedAppointment.appointment_date)}
            isOpen={isRescheduleOpen}
            onClose={() => setIsRescheduleOpen(false)}
            onReschedule={onReschedule}
          /> */}
          <StartAppointment
            appointmentId={selectedAppointment.id}
            patientName={selectedAppointment.patient.name}
            isOpen={isStartAppointmentOpen}
            onClose={() => setIsStartAppointmentOpen(false)}
            onStart={onStartAppointment}
          />
        </>
      )}
    </DoctorSidebar>
  );
}

