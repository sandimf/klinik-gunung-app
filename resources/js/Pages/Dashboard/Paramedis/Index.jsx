import React from "react";
import { usePage, Head } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { CheckCircle, XCircle, ClipboardCheck } from "lucide-react";

export default function Index({ waitingCount, sehatCount = 0, tidakSehatCount = 0, finishedCount = 0, waitingList = [] }) {
    const user = usePage().props.auth.user;

    return (
        <ParamedisSidebar header={"Over View"}>
            <Head title="Over View" />
            {waitingCount > 0 && (
                <Alert>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <AlertTitle>Screening Baru Menunggu</AlertTitle>
                    <AlertDescription>
                        Ada <b>{waitingCount}</b> screening baru yang belum diperiksa!
                    </AlertDescription>
                </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            Pasien Sehat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{sehatCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="h-6 w-6 text-red-500" />
                            Pasien Tidak Sehat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{tidakSehatCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardCheck className="h-6 w-6 text-blue-500" />
                            Screening Selesai
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{finishedCount}</div>
                    </CardContent>
                </Card>
            </div>
            {waitingList.length > 0 && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Daftar Tunggu Pemeriksaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y">
                            {waitingList.map((patient) => (
                                <li key={patient.id} className="py-2 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                                        <span className="font-medium">{patient.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : ""}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </ParamedisSidebar>
    );
}
