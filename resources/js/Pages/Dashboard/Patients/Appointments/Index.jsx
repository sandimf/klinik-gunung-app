import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import CreateAppointmentModal from "./Partials/CreateAppointmentModal";
import CancelAppointmentModal from "./Partials/CancelAppointmentModal";
import { Head, useForm } from "@inertiajs/react";
import { CheckCircle2, X } from "lucide-react";
import MedicalHeader from "./_components/table-header";
import { Badge } from "@/Components/ui/badge";

export default function Appointments({ appointments: initialAppointments }) {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const { put, processing } = useForm();

    const createAppointment = (newAppointment) => {
        setAppointments([
            ...appointments,
            { ...newAppointment, id: appointments.length + 1 },
        ]);
        setIsCreateModalOpen(false);
    };

    const openCancelModal = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setIsCancelModalOpen(true);
    };

    const cancelAppointment = (appointmentId) => {
        put(
            route("appointments.update", appointmentId),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsCancelModalOpen(false);
                    setAppointments(
                        appointments.map((appointment) =>
                            appointment.id === appointmentId
                                ? { ...appointment, status: "cancelled" }
                                : appointment
                        )
                    );
                },
                onError: (errors) => {
                    // Error will be handled by flash messages from backend
                },
            }
        );
    };

    return (
        <Sidebar header={"Appointments"}>
            <Head title="Appointments" />
            <MedicalHeader setIsCreateModalOpen={setIsCreateModalOpen} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Tanggal Pengunjungan</TableHead>
                        <TableHead>Waktu Pengunjungan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>{appointment.patient.name}</TableCell>
                            <TableCell>
                                {appointment.appointment_date}
                            </TableCell>
                            <TableCell>
                                {appointment.appointment_time}
                            </TableCell>
                            <TableCell>
                                <Badge>
                                    {appointment.status === "Cancelled"
                                        ? "Dibatalkan"
                                        : appointment.status}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                {appointment.status !== "Cancelled" &&
                                appointment.status !== "Completed" ? (
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            openCancelModal(appointment.id)
                                        }
                                        disabled={processing}
                                    >
                                        Batalkan
                                    </Button>
                                ) : (
                                    <span>-</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
