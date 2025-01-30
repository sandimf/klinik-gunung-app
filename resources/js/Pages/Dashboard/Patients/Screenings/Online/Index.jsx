import { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import ScreeningInfo from "@/Pages/Dashboard/Patients/Screenings/_components/ScreeningInfoOnline";
import NoScreeningData from "@/Pages/Dashboard/Patients/Screenings/_components/NoScreeningData";
import { CheckCircle, AlertCircle, Loader2, Info } from "lucide-react";
import { CardContent } from "@/Components/ui/card";
import { Toaster } from "sonner";
import useFlashToast from "@/hooks/flash";

export default function ScreeningOnline({ screening }) {
    const user = usePage().props.auth.user;
    const hasScreening = screening !== null && screening !== undefined;
    const isPaymentCompleted =
        hasScreening && screening.payment_status === "completed";
    const isPaymentPending =
        hasScreening && screening.payment_status === "pending";
    const isPaymentChecking =
        hasScreening && screening.payment_status === "checking";

    useFlashToast();

    return (
        <SideBar header="Screening Now">
            <Head title="Screening Status" />
            <Toaster position="top-center" />
            <div className="container mx-auto py-6 px-4 max-w-full">
                {isPaymentCompleted && (
                    <Alert className="mb-6">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>
                            Screening Completed Successfully
                        </AlertTitle>
                        <AlertDescription>
                            Terimakasih sudah melakukan pembayaran {user.name}.
                            Pembayaran kamu sudah selesai
                        </AlertDescription>
                    </Alert>
                )}

                {isPaymentChecking && (
                    <Alert className="mb-6" variant="info">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertTitle>
                            Informasi Pembayaran Sudah Terkirim.
                        </AlertTitle>
                        <AlertDescription>
                            Kami sedang memverifikasi pembayaran Anda. Cek email
                            dan Halaman ini secara berkala.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Jika pasien belum membayaran tampilkan alert */}
                {isPaymentPending && (
                    <Alert className="mb-6" variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Payment Required</AlertTitle>
                        <AlertDescription>
                            Lakukan pembayaran untuk mendapatkan qrcode.
                        </AlertDescription>
                    </Alert>
                )}

                <CardContent className="pt-6">
                    {!hasScreening ? (
                        <NoScreeningData
                            detailRouteName={route("screening-online.create")}
                        />
                    ) : isPaymentPending ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={"Payment"}
                            detailRouteName={route(
                                "payment.create",
                                screening.id
                            )}
                        />
                    ) : isPaymentChecking ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={"Sedang pengecekan"}
                            detailRouteName={route("screening-online.index")}
                        />
                    ) : isPaymentCompleted ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={"QrCode"}
                            detailRouteName={route(
                                "result-screening.show",
                                screening.id
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
