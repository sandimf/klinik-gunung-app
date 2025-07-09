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
import SideBar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Head } from "@inertiajs/react";
import { ArrowLeft, FileText, Calendar, User, Phone, Info, Stethoscope } from 'lucide-react';
import { EditAnswerDialog } from "../_components/edit-answer";
import { Toaster } from "sonner";
import EditPhysicalDialog from "../_components/EditPhysicalDialog";

// Fungsi untuk format tanggal ke format '23 Maret 2025'
function formatTanggal(dateString) {
    if (!dateString) return '-';
    const bulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const tgl = date.getDate();
    const bln = bulan[date.getMonth()];
    const thn = date.getFullYear();
    return `${tgl} ${bln} ${thn}`;
}

export default function ScreeningDetails({ patient, questionsAndAnswers, physicalExaminations }) {
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
            <Link href={route("consultation.index")}>
                <Button variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
            </Link>
            <Tabs defaultValue="questionnaire">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="questionnaire">Kuesioner</TabsTrigger>
                    <TabsTrigger value="medical">Pemeriksaan Medis</TabsTrigger>
                    <TabsTrigger value="personal-info">Informasi Pasien</TabsTrigger>
                </TabsList>
                <TabsContent value="questionnaire">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                Jawaban Kuesioner
                            </CardTitle>
                            <CardDescription>
                                Jawaban <b>{patient.name}</b> kuesioner screening
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Pertanyaan</TableHead>
                                        <TableHead>Jawaban</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {qaState.map((qa, index) => (
                                        <TableRow key={qa.id}>
                                            <TableCell>{index + 1}</TableCell>
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

                <TabsContent value="medical">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-6 w-6" />
                                Pemeriksaan Fisik
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(physicalExaminations && physicalExaminations.length > 0) ? (
                                <div className="space-y-6">
                                    {physicalExaminations.map((exam, idx) => (
                                        <Card key={exam.id || idx} className="bg-muted/50">
                                            <CardHeader>
                                                <CardTitle className="text-base font-semibold">Pemeriksaan Fisik #{idx + 1}</CardTitle>
                                                <CardDescription>{formatTanggal(exam.created_at)}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Tekanan Darah</span>
                                                        <span className="font-medium">{exam.blood_pressure}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Denyut Nadi</span>
                                                        <span className="font-medium">{exam.heart_rate}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Saturasi Oksigen</span>
                                                        <span className="font-medium">{exam.oxygen_saturation}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Frekuensi Napas</span>
                                                        <span className="font-medium">{exam.respiratory_rate}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Suhu Tubuh</span>
                                                        <span className="font-medium">{exam.body_temperature}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Penilaian Fisik</span>
                                                        <span className="font-medium">
                                                            {exam.physical_assessment === 'sangat_baik' ? 'Sangat Baik' :
                                                                exam.physical_assessment === 'cukup_baik' ? 'Cukup Baik' :
                                                                    exam.physical_assessment === 'buruk' ? 'Buruk' :
                                                                        exam.physical_assessment === 'cukup' ? 'Cukup' :
                                                                            exam.physical_assessment}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Alasan</span>
                                                        <span className="font-medium">{exam.reason}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Saran Medis</span>
                                                        <span className="font-medium">{exam.medical_advice}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-muted-foreground">Status Kesehatan</span>
                                                        <span className="font-medium">
                                                            {exam.health_status === "sehat" && "Sehat"}
                                                            {exam.health_status === "tidak_sehat" && "Tidak Sehat"}
                                                            {(!exam.health_status || !["sehat", "tidak_sehat"].includes(exam.health_status)) && "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <EditPhysicalDialog exam={exam} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div>Tidak ada data pemeriksaan medis.</div>
                            )}
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
    physicalExaminations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        created_at: PropTypes.string.isRequired,
        blood_pressure: PropTypes.string.isRequired,
        heart_rate: PropTypes.string.isRequired,
        body_temperature: PropTypes.string.isRequired,
    })).isRequired,
    queue: PropTypes.any, // Add more specific PropTypes if needed
};

