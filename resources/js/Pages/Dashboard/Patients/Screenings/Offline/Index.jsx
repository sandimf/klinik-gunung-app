import { Head, usePage } from "@inertiajs/react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import ScreeningInfo from "@/Pages/Dashboard/Patients/Screenings/Partials/ScreeningInfo";
import NoScreeningData from "@/Pages/Dashboard/Patients/Screenings/Partials/NoScreeningData";
import { CheckCircle } from 'lucide-react';
import { CardContent } from "@/Components/ui/card";

export default function HistoryOffline({ screening }) {
    const user = usePage().props.auth.user;
    const hasScreening = screening !== null && screening !== undefined;
    const isPending = hasScreening && screening.screening_status === "pending";
    const isCompleted = hasScreening && screening.screening_status === "completed";
    return (
        <SideBar header="Screening Now">
            <Head title="Screening Status" />
            <div className="container mx-auto py-6 px-4 max-w-full">
                {isCompleted && (
                    <Alert className="mb-6">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>
                            Screening Completed Successfully
                        </AlertTitle>
                        <AlertDescription>
                            Thank you for completing the screening, {user.name}.
                            Your results are now available for review.
                        </AlertDescription>
                    </Alert>
                )}

                <CardContent className="pt-6">
                    {!screening ? (
                        <NoScreeningData
                            detailRouteName={route("screening.create")}
                        />
                    ) : isPending ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={'Detail'}
                            detailRouteName={route(
                                "screening.show",
                                screening.id
                            )}
                        />
                    ) : isCompleted ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={'Detail'}
                            detailRouteName={route(
                                "screening.show",
                                screening.id
                            )}
                        />
                    ) : (
                        <NoScreeningData
                            detailRouteName={route("screening.create")}
                        />
                    )}
                </CardContent>
            </div>
        </SideBar>
    );
}

