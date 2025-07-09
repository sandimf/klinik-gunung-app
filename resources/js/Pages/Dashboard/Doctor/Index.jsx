import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Index({ waitingConsultationCount = 0 }) {
    const user = usePage().props.auth.user;
    return (
        <DoctorSidebar header={'Dashboard'}>
            <Head title='Dashboard Dokter' />
            {waitingConsultationCount > 0 && (
                <Alert className="mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <AlertTitle>Konsultasi Baru Menunggu</AlertTitle>
                    <AlertDescription>
                        Ada <b>{waitingConsultationCount}</b> konsultasi baru yang belum diperiksa!
                    </AlertDescription>
                </Alert>
            )}
        </DoctorSidebar>
    );
}
