import React from 'react';
import { Clock, CheckCircle2, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { toast } from "sonner";

export function StartAppointment({ appointmentId, patientName, isOpen, onClose }) {
  const { post, processing, reset } = useForm({
    appointment_id: appointmentId,
    status: 'confirmed', // Tambahkan status sebagai default
  });

  const handleStart = (e) => {
    e.preventDefault();

    post(route('appointments.start'), {
      appointment_id: appointmentId, // Kirim ID appointment ke controller
      status: 'confirmed', // Kirim data status ke server
      onSuccess: () => {
        reset(); // Reset form setelah berhasil
        onClose(); // Tutup modal
        toast.success('Appointment confirmed successfully!', {
          icon: <CheckCircle2  />,
        });
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Failed to confirm the appointment. Please try again.', {
          icon: <X className="h-5 w-5 text-red-500" />,
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Appointment</DialogTitle>
          <DialogDescription>
            You are about to confirm the appointment with {patientName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to confirm this appointment now?</p>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleStart} disabled={processing}>
            <Clock className="mr-2 h-4 w-4" />
            {processing ? 'Confirming...' : 'Confirm Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
