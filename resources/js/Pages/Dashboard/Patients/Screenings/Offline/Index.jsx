import { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import ScreeningInfo from "@/Pages/Dashboard/Patients/Screenings/_components/ScreeningInfo";
import NoScreeningData from "@/Pages/Dashboard/Patients/Screenings/_components/NoScreeningData";
import { CheckCircle,Info } from 'lucide-react';
import { CardContent } from "@/Components/ui/card";
import {toast, Toaster} from "sonner"

export default function HistoryOffline({ screening }) {
    const user = usePage().props.auth.user;
    const hasScreening = screening !== null && screening !== undefined;
    const isPending = hasScreening && screening.screening_status === "Pending";
    const isCompleted = hasScreening && screening.screening_status === "Completed";

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            toast(flash.message, {
                icon: <Info className="h-5 w-5 text-green-500"/>
            });
        }
    }, [flash.message]);

    return (
        <SideBar header="Screening Now">
            <Head title="Screening Status" />
            <Toaster position="top-center" />
            <div className="container mx-auto py-6 px-4 max-w-full">
                {isCompleted && (
                    <Alert className="mb-6">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>
                            Screening Completed Successfully
                        </AlertTitle>
                        <AlertDescription>
                        {user.name}, Screening Anda Sudah Di Periksa.
                        </AlertDescription>
                        <div className="mt-2 text-sm font-medium text-gray-500">
                                Lakukan pembayaran untuk melihat hasil pemeriksaan.
                            </div>
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
                                screening.uuid
                            )}
                        />
                    ) : isCompleted ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={'Detail'}
                            detailRouteName={route(
                                "screening.show",
                                screening.uuid
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

