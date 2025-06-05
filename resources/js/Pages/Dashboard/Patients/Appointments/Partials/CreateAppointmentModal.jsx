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
import { Toaster, toast } from "sonner";
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
                toast.success("Janji temu berhasil dibuat!!", {
                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
                });
            },
            onError: (errors) => {
                console.error(errors);
                toast.error("Gagal membuat janji temu. Silakan coba lagi.", {
                    icon: <X className="w-5 h-5 text-red-500" />,
                });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <Toaster position="top-center" />
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
