import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";

export default function CreateAppointmentModal({ isOpen, onClose, onCreateAppointment }) {
  const { data, setData, post, reset, errors } = useForm({
    appointment_date: '',
    is_scheduled: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('appointments.store'), {
      data,
      onSuccess: () => {
        reset(); // Reset form setelah sukses
        onClose(); // Tutup modal
        if (onCreateAppointment) onCreateAppointment(data); // Perbarui daftar appointment jika perlu
      },
      onError: (errors) => {
        console.error(errors); // Tangani error jika ada
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appointment_date">Date</Label>
            <Input
              id="appointment_date"
              type="date"
              value={data.appointment_date}
              onChange={(e) => setData('appointment_date', e.target.value)}
              required
            />
            {errors.appointment_date && (
              <p className="text-red-500 text-sm">{errors.appointment_date}</p>
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
