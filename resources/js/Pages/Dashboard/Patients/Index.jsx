import React from 'react';
import { Head,usePage } from "@inertiajs/react";
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { CalendarDays, Activity, Pill, Phone } from "lucide-react";

export default function Dashboard({ auth, screening, visitCount }) {
    const user = usePage().props.auth.user;
    return (
        <Sidebar header={'Patient Dashboard'}>
            <Head title="Dashboard" />
            <div className='w-full overflow-x-auto pb-2'>
                <h1 className='text-2xl font-bold tracking-tight mb-4'>Selamat Datang Di Klinik Gunung, {user.name}</h1>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="screening">Screening</TabsTrigger>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="records">Medical Records</TabsTrigger>
                        <TabsTrigger value="charts">Health Charts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Your Screening
                                    </CardTitle>
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {screening ? (
                                        <>
                                            <div className="text-2xl font-bold">
                                                {new Date(screening.created_at).toLocaleDateString('id-ID')}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                               Hour {new Date(screening.created_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                })}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-center text-muted-foreground">You haven't had a screening.</p>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Recent Visits
                                    </CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{visitCount}</div>
                                    <p className="text-xs text-muted-foreground">
                                        In the last 3 months
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Prescriptions
                                    </CardTitle>
                                    <Pill className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2</div>
                                    <p className="text-xs text-muted-foreground">
                                        Active prescriptions
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Emergency Contact
                                    </CardTitle>
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Jane Doe</div>
                                    <p className="text-xs text-muted-foreground">
                                        +62 123-456-7890
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    {/* We'll add other TabsContent components later */}
                </Tabs>
            </div>
        </Sidebar>
    );
}
