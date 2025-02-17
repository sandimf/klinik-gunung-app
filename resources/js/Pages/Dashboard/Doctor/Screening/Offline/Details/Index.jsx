import React from "react";
import { Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import { Head } from "@inertiajs/react";
import { ArrowLeft } from 'lucide-react';

export default function ScreeningDetails({ patient, questionsAndAnswers, queue }) {
    const capitalizeWords = (str) => {
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    return (
        <SideBar header={`Detail kuesioner ${capitalizeWords(patient.name)}`}>
            <Head title={`Detail kuesioner ${capitalizeWords(patient.name)}`} />

            <Link href={route('paramedis.screening')}>
                <Button
                    variant="outline"
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
            </Link>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Detail Kuesioner {capitalizeWords(patient.name)}
                    </CardTitle>
                    <CardDescription>
                        Informasi lengkap hasil screening pendakian
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <p> Nama Pasien: {" "}
                            <strong>{capitalizeWords(patient.name)}</strong>
                        </p>
                        <p> Nomor Antrian: {" "}
                            <strong>{queue}</strong>
                        </p>
                        <ul>
                            {questionsAndAnswers.map((qa, index) => (
                                <li key={index} className="screening-answer">
                                    <p>
                                        <strong>{qa.question}</strong>
                                    </p>
                                    <p>{qa.answer || "-"}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </SideBar>
    );
}

