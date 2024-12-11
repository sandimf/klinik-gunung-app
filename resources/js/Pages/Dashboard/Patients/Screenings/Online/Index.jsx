import { Head } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import ScreeningInfo from '@/Pages/Dashboard/Patients/Screenings/Partials/ScreeningInfo';
import NoScreeningData from '@/Pages/Dashboard/Patients/Screenings/Partials/NoScreeningData';
import { CheckCircle } from 'lucide-react';
import {CardContent } from "@/Components/ui/card";

export default function HistoryOffline({ auth, screening }) {
    const hasScreening = screening !== null;
    const isCompleted = hasScreening && screening.screening_status === 'pending';
    const showForm = hasScreening && screening.screening_status === null;
    const isOnline = hasScreening && screening.answers.length > 0
    ? screening.answers[0].isOnline
    : false;
    console.log(screening)
    return (
        <SideBar header="Screening Online">
            <Head title="Screening Status" />
            <div className="container mx-auto py-6 px-4 max-w-full">
                {hasScreening && screening.screening_status === 'completed' && (
                    <Alert className="mb-6">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Screening Completed Successfully</AlertTitle>
                        <AlertDescription>
                            Thank you for completing the screening, {auth.user.name}. Your results are now available for review.
                        </AlertDescription>
                    </Alert>
                )}
                <CardContent className="pt-6">
                    {isCompleted ? (
                        <ScreeningInfo screening={screening} detailRouteName={route('screening.show', screening.id)} />
                    ) : showForm ? (
                        // Ganti ini dengan komponen/form Anda untuk mengisi screening baru
                        <NoScreeningData detailRouteName={route('screening-online.create')} />
                    ) : (
                        <div>
                        <NoScreeningData detailRouteName={route('screening-online.create')} />
                        </div>
                        
                    )}
                </CardContent>
                    </div>
            </SideBar>
    );
}
