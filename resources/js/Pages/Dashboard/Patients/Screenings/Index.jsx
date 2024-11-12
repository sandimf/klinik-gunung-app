import { Head } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import ScreeningInfo from '@/Pages/Dashboard/Patients/Screenings/Partials/ScreeningInfo';
import NoScreeningData from '@/Pages/Dashboard/Patients/Screenings/Partials/NoScreeningData';
import { CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";

export default function HistoryOffline({ auth, screening }) {
    const hasScreening = screening !== null;
    const isOnline = hasScreening && screening.answers.length > 0
    ? screening.answers[0].isOnline
    : false;
    console.log(screening)
    return (
        <SideBar header="Screening Now">
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

                <Card className="w-full">
                    <CardHeader className="border-b bg-muted/40">
                        <CardTitle className="text-2xl font-bold">Screening Now</CardTitle>
                        <CardDescription>
                            View and manage your screening information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {hasScreening ? (
                            <ScreeningInfo screening={screening} detailRouteName={route('screening.show', screening.id)} />
                        ) : (
                            <NoScreeningData detailRouteName={route('screening.create')} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </SideBar>
    );
}
