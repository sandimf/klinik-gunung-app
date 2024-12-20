import { Head, usePage } from "@inertiajs/react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import ScreeningInfo from "@/Pages/Dashboard/Patients/Screenings/_components/ScreeningInfo";
import NoScreeningData from "@/Pages/Dashboard/Patients/Screenings/_components/NoScreeningData";
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CardContent } from "@/Components/ui/card";

export default function ScreeningOnline({ screening }) {
    const user = usePage().props.auth.user;
    const hasScreening = screening !== null && screening !== undefined;
    const isPending = hasScreening && screening.screening_status === "pending";
    const isCompleted = hasScreening && screening.screening_status === "completed";
    const isPaymentPending = hasScreening && screening.payment_status === "pending";
    const isPaymentChecking = hasScreening && screening.payment_status === "checking";

    console.log(screening);
    return (
        <SideBar header="Screening Now">
            <Head title="Screening Status" />
            <div className="container mx-auto py-6 px-4 max-w-full">
                {isCompleted && !isPaymentPending && !isPaymentChecking && (
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

                {isPaymentChecking && (
                    <Alert className="mb-6" variant="info">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertTitle>
                            Payment Verification in Progress
                        </AlertTitle>
                        <AlertDescription>
                            We are currently verifying your payment.
                        </AlertDescription>
                    </Alert>
                )}
                
                {isPaymentPending && (
                    <Alert className="mb-6" variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>
                            Payment Required
                        </AlertTitle>
                        <AlertDescription>
                            You need to complete the payment to view your screening results.
                        </AlertDescription>
                    </Alert>
                )}

                <CardContent className="pt-6">
                    {!hasScreening ? (
                        <NoScreeningData
                            detailRouteName={route("screening-online.create")}
                        />
                    ) : isPending ? (
                        isPaymentChecking ? (
                            <ScreeningInfo
                                screening={screening}
                                RouteName={'Payment Verification'}
                                detailRouteName={route(
                                    "payment.create",
                                    screening.id
                                )}
                            />
                        ) : (
                            <ScreeningInfo
                                screening={screening}
                                RouteName={'Payment'}
                                detailRouteName={route(
                                    "payment.create",
                                    screening.id
                                )}
                            />
                        )
                    ) : isPaymentPending ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={'Payment'}
                            detailRouteName={route(
                                "payment.create",
                                screening.id
                            )}
                        />
                    ) : isPaymentChecking ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={'Payment Verification'}
                            detailRouteName={route(
                                "dashboard",
                                screening.id
                            )}
                        />
                    ) : isCompleted ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={'Result'}
                            detailRouteName={route(
                                "result-screening.show",
                                screening.result[0].id
                            )}
                        />
                    ) : (
                        <NoScreeningData
                            detailRouteName={route("screening-online.create")}
                        />
                    )}
                </CardContent>
            </div>
        </SideBar>
    );
}

