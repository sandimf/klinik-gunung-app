import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

export default function CancelAppointmentModal({
    isOpen,
    onClose,
    onConfirm,
    appointmentId,
}) {
    const handleConfirm = () => {
        onConfirm(appointmentId);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Batalkan Janji Temu</DialogTitle>
                </DialogHeader>
                Apakah Anda yakin ingin membatalkan janji temu ini? Tindakan ini
                tidak dapat dibatalkan.
                <DialogFooter>
                    <Button onClick={onClose}>Tidak</Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Ya, Batalkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
