import React from "react";
import { Head, usePage } from "@inertiajs/react";
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { CalendarDays, Activity, Pill, Phone } from "lucide-react";
import AppVersion from '@/Components/app-version'
export default function Dashboard({ screening, visitCount, emergency, appVersion }) {
    const user = usePage().props.auth.user;

    return (
        <>
            <Sidebar header={"Welcome"}>
                <Head title="Dashboard" />
                <div className="overflow-x-auto pb-2 w-full">
                    <h1 className="mb-4 text-2xl font-bold tracking-tight">
                        Selamat Datang di Klinik Gunung,{user.name}{" "}
                    </h1>


                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Screening
                                </CardTitle>
                                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {screening ? (
                                    <>
                                        <div className="text-2xl font-bold">
                                            {new Date(
                                                screening.created_at
                                            ).toLocaleDateString("id-ID")}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Hour{" "}
                                            {new Date(
                                                screening.created_at
                                            ).toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Kamu Belum Memiliki Screening
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Kujungan Terkini
                                </CardTitle>
                                <Activity className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {visitCount}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Dalam 3 bulan terakhir
                                </p>
                            </CardContent>
                        </Card>
                        {/* <Card>
                                <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium">
                                        Lorem, ipsum dolor.
                                    </CardTitle>
                                    <Pill className="w-4 h-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        Lorem, ipsum.
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing.
                                    </p>
                                </CardContent>
                            </Card> */}
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Emergency Contact
                                </CardTitle>
                                <Phone className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {emergency ? (
                                    <>
                                        <div className="text-2xl font-bold">
                                            {emergency.contact}
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {emergency.name}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        -
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Sidebar>
            <AppVersion appVersion={appVersion} />
        </>
    );
}
