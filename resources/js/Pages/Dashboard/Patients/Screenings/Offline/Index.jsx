import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import ScreeningInfo from "@/Pages/Dashboard/Patients/Screenings/_components/ScreeningInfo";
import NoScreeningData from "@/Pages/Dashboard/Patients/Screenings/_components/NoScreeningData";
import { CheckCircle } from "lucide-react";
import { CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default function HistoryOffline({ screening }) {
    const user = usePage().props.auth.user;
    const hasScreening = screening !== null && screening !== undefined;
    const isPending = hasScreening && screening.screening_status === "Pending";
    const isCompleted =
        hasScreening && screening.screening_status === "Completed";

    // Tambahkan state untuk saran AI
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);
    const [suggestionError, setSuggestionError] = useState(null);

    // Handler untuk klik tombol
    const handleFetchAiSuggestion = () => {
        setLoadingSuggestion(true);
        setSuggestionError(null);
        fetch("/screening/ai-suggestion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            },
            body: JSON.stringify({ screening_id: screening.id }),
        })
            .then((res) => res.json())
            .then((data) => {
                setAiSuggestion(data.suggestion);
                setLoadingSuggestion(false);
            })
            .catch((err) => {
                setSuggestionError("Gagal mengambil saran AI");
                setLoadingSuggestion(false);
            });
    };

    return (
        <SideBar header="Screening Now">
            <Head title="Screening Status" />
            <div className="container px-4 py-6 mx-auto max-w-full">
                <CardContent className="pt-6">
                    {/* Saran AI & tombol di bawah */}
                    {isPending && (
                        <div className="mb-6 flex flex-col items-center">
                            <Button
                                variant="link"
                                onClick={handleFetchAiSuggestion}
                                disabled={loadingSuggestion || aiSuggestion}
                            >
                                {loadingSuggestion
                                    ? "Mengambil saran AI..."
                                    : aiSuggestion
                                        ? "Rekomendasi AI Ditampilkan"
                                        : "Klik disini untuk mendapatkan rekomendasi dari AI"}
                            </Button>
                            {suggestionError && (
                                <div className="text-sm text-red-500 mt-2">{suggestionError}</div>
                            )}
                            {aiSuggestion && (
                                <Alert className="">
                                    <AlertTitle>Rekomendasi AI untuk Anda:</AlertTitle>
                                    <AlertDescription>
                                        <div className="whitespace-pre-line">{aiSuggestion}</div>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                    {(isCompleted || isPending) && (
                        <>
                            {isCompleted && (
                                <Alert className="mb-6">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <AlertTitle>
                                        Screening Berhasil Dilakukan
                                    </AlertTitle>
                                    <AlertDescription>
                                        {user.name}, Screening Anda Sudah Di Periksa.
                                    </AlertDescription>
                                    <div className="mt-2 text-sm font-medium text-gray-500">
                                        Lakukan pembayaran untuk melihat hasil pemeriksaan.
                                    </div>
                                </Alert>
                            )}
                        </>
                    )}
                    {!screening ? (
                        <NoScreeningData
                            detailRouteName={route("screening.create")}
                        />
                    ) : isPending ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={"Detail"}
                            detailRouteName={route(
                                "screening.show",
                                screening.uuid
                            )}
                        />
                    ) : isCompleted ? (
                        <ScreeningInfo
                            screening={screening}
                            RouteName={"Detail"}
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
