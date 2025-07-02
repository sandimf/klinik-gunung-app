import React from "react";
import { usePage, Head } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Stethoscope, Users, Activity } from "lucide-react";

export default function Index() {
    const user = usePage().props.auth.user;

    const stats = [
        {
            title: "Pasien Hari Ini",
            value: 12,
            icon: <Users className="h-6 w-6 text-primary" />,
        },
        {
            title: "Tindakan Selesai",
            value: 8,
            icon: <Stethoscope className="h-6 w-6 text-primary" />,
        },
        {
            title: "Progress Shift",
            value: "80%",
            icon: <Activity className="h-6 w-6 text-primary" />,
            progress: 80,
        },
    ];

    return (
        <ParamedisSidebar header={"Dashboard Paramedis"}>
            <Head title="Dashboard Paramedis" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Selamat Datang di Dashboard Paramedis, {user.name} 👋
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stat.value}
                                </div>
                                {stat.progress !== undefined && (
                                    <Progress value={stat.progress} className="mt-2" />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </ParamedisSidebar>
    );
}
