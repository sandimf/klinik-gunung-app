import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

export default function CancelAppointmentModal({ isOpen, onClose, onConfirm, appointmentId }) {
  const handleConfirm = () => {
    onConfirm(appointmentId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Appointment</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to cancel this appointment? This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No, Keep Appointment
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Yes, Cancel Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

