import { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import ScreeningInfo from "@/Pages/Dashboard/Patients/Screenings/_components/ScreeningInfoOnline";
import NoScreeningData from "@/Pages/Dashboard/Patients/Screenings/_components/NoScreeningData";
import { CheckCircle, AlertCircle, Loader2, Info } from "lucide-react";
import { CardContent } from "@/Components/ui/card";

export default function ScreeningOnline({ screening }) {
    const user = usePage().props.auth.user;
    const hasScreening = screening !== null && screening !== undefined;
    const isPaymentCompleted =
        hasScreening && screening.payment_status === "completed";
    const isPaymentPending =
        hasScreening && screening.payment_status === "pending";
    const isPaymentChecking =
        hasScreening && screening.payment_status === "checking";

    return (
        <SideBar header="Screening Online">
            <Head title="Screening Status" />
            <div className="container max-w-full px-4 py-6 mx-auto">
                {isPaymentCompleted && (
                    <Alert className="mb-6">
                        <CheckCircle className="w-4 h-4" />
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
                        <Loader2 className="w-4 h-4 animate-spin" />
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
                        <AlertCircle className="w-4 h-4" />
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
