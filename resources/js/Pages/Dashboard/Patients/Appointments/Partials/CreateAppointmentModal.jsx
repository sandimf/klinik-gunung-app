import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";
import { CheckCircle2, X, Clock } from "lucide-react";

export default function CreateAppointmentModal({
    isOpen,
    onClose,
    onCreateAppointment,
}) {
    const { data, setData, post, reset, errors } = useForm({
        appointment_date: "",
        appointment_time: "",
        is_scheduled: true,
    });

    const handleTimeChange = (e) => {
        const time = e.target.value; // Format HH:MM
        const formattedTime = `${time}:00`; // Tambahkan detik
        setData("appointment_time", formattedTime);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("appointments.store"), {
            data,
            onSuccess: () => {
                reset(); // Reset form after success
                onClose(); // Close modal
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buat Janji Temu</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="appointment_date">
                            Tanggal Janji Temu
                        </Label>
                        <Input
                            id="appointment_date"
                            type="date"
                            value={data.appointment_date}
                            onChange={(e) =>
                                setData("appointment_date", e.target.value)
                            }
                            required
                        />
                        {errors.appointment_date && (
                            <p className="text-sm text-red-500">
                                {errors.appointment_date}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="appointment_time">Jam Janji Temu</Label>
                        <div className="flex items-center">
                            <Clock className="mr-2 w-4 h-4" />
                            <Input
                                id="appointment_time"
                                type="time"
                                value={data.appointment_time}
                                onChange={handleTimeChange}
                                className="flex-grow"
                            />
                        </div>
                        {errors.appointment_time && (
                            <p className="text-sm text-red-500">
                                {errors.appointment_time}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Appointment</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
