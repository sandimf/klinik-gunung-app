import React from "react";
import PropTypes from 'prop-types';
import { Link } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import SideBar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Head } from "@inertiajs/react";
import { ArrowLeft, FileText, Calendar, User, Phone, Info } from 'lucide-react';
import { EditAnswerDialog } from "./_components/edit-answer";
import { Toaster } from "sonner";

export default function ScreeningDetails({ patient, questionsAndAnswers, queue }) {
    const [qaState, setQaState] = React.useState(questionsAndAnswers);

    const capitalizeWords = (str) => {
        return str
            .split(" ")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
    };

    const handleSaveAnswer = (id, newAnswer) => {
        setQaState((prevState) =>
            prevState.map((qa) =>
                qa.id === id ? { ...qa, answer: newAnswer } : qa
            )
        );
    };

    const screeningDetails = [
        {
            label: "Nama",
            value: patient.name,
            icon: <User className="h-4 w-4" />,
        },
        {
            label: "Umur",
            value: patient.age,
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            label: "Jenis Kelamin",
            value: patient.gender,
            icon: <User className="h-4 w-4" />,
        },
        {
            label: "Nomor Kontak",
            value: patient.contact,
            icon: <Phone className="h-4 w-4" />,
        },
        {
            label: "NIK",
            value: patient.nik,
            icon: <Info className="h-4 w-4" />,
        },
        {
            label: "Tanggal Lahir",
            value: patient.date_of_birth,
            icon: <Calendar className="h-4 w-4" />,
        },
    ];

    return (
        <SideBar header={`Detail kuesioner ${capitalizeWords(patient.name)}`}>
            <Head title={`Detail kuesioner ${capitalizeWords(patient.name)}`} />
            <Toaster position="top-center" />
            <Link href={route("paramedis.screeningss")}>
                <Button variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
            </Link>
            <Tabs defaultValue="questionnaire">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="questionnaire">Kuesioner</TabsTrigger>
                    <TabsTrigger value="personal-info">
                        Informasi Pasien
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="questionnaire">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                Jawaban Kuesioner
                            </CardTitle>
                            <CardDescription>
                                Jawaban {patient.name} kuesioner screening
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Pertanyaan</TableHead>
                                        <TableHead>Jawaban</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {qaState.map((qa) => (
                                        <TableRow key={qa.id}>
                                            <TableCell>{qa.id}</TableCell>
                                            <TableCell>{qa.question}</TableCell>
                                            <TableCell>{qa.answer || "-"}</TableCell>
                                            <TableCell>
                                                <EditAnswerDialog
                                                    id={qa.id}
                                                    question={qa.question}
                                                    answer_text={qa.answer || ""}
                                                    onSave={handleSaveAnswer}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="personal-info">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-6 w-6" />
                                Informasi Pribadi Pasien
                            </CardTitle>
                            <CardDescription>Detail Informasi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {screeningDetails.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            {detail.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {detail.label}
                                            </p>
                                            <p className="font-medium">
                                                {detail.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </SideBar>
    );
}

ScreeningDetails.propTypes = {
    patient: PropTypes.shape({
        name: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        gender: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
        nik: PropTypes.string.isRequired,
        date_of_birth: PropTypes.string.isRequired,
    }).isRequired,
    questionsAndAnswers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        question: PropTypes.string.isRequired,
        answer: PropTypes.string,
    })).isRequired,
    queue: PropTypes.any, // Add more specific PropTypes if needed
};

