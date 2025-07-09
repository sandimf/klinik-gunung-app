import React from "react";
import PropTypes from "prop-types";
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
import { ArrowLeft, FileText, Calendar, User, Phone, Info } from "lucide-react";
import { Toaster } from "sonner";

export default function ScreeningDetails({
    patient,
    questionsAndAnswers,
    queue,
    physicalExaminations = [], // Add default value
}) {
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

    const screeningDetails = [
        {
            label: "Nama",
            value: patient.name,
            icon: <User className="w-4 h-4" />,
        },
        {
            label: "Umur",
            value: patient.age,
            icon: <Calendar className="w-4 h-4" />,
        },
        {
            label: "Jenis Kelamin",
            value: patient.gender,
            icon: <User className="w-4 h-4" />,
        },
        {
            label: "Nomor Kontak",
            value: patient.contact,
            icon: <Phone className="w-4 h-4" />,
        },
        {
            label: "NIK",
            value: patient.nik,
            icon: <Info className="w-4 h-4" />,
        },
        {
            label: "Tanggal Lahir",
            value: patient.date_of_birth,
            icon: <Calendar className="w-4 h-4" />,
        },
    ];

    const healthcheckDetails =
        physicalExaminations && physicalExaminations.length > 0
            ? [
                {
                    label: "Tekanan Darah",
                    value:
                        physicalExaminations[0].blood_pressure ||
                        "Tidak ada data",
                },
                {
                    label: "Detak Jantung",
                    value:
                        physicalExaminations[0].heart_rate ||
                        "Tidak ada data",
                },
                {
                    label: "Saturasi Oksigen",
                    value:
                        physicalExaminations[0].oxygen_saturation ||
                        "Tidak ada data",
                },
                {
                    label: "Tekanan Darah",
                    value:
                        physicalExaminations[0].respiratory_rate ||
                        "Tidak ada data",
                },
                {
                    label: "Suhu Tubuh",
                    value:
                        physicalExaminations[0].body_temperature ||
                        "Tidak ada data",
                },
                {
                    label: "Penilaian Fisik",
                    value:
                        physicalExaminations[0].physical_assessment === 'sangat_baik'
                            ? 'Sangat Baik'
                            : physicalExaminations[0].physical_assessment === 'cukup_baik'
                                ? 'Cukup Baik'
                                : physicalExaminations[0].physical_assessment === 'tidak_direkomendasikan'
                                    ? 'Tidak Direkomendasikan'
                                    : 'Tidak ada data',
                },
                {
                    label: "Alasan",
                    value: physicalExaminations[0].reason || "Tidak ada data",
                },
                {
                    label: "Saran Medis",
                    value:
                        physicalExaminations[0].medical_advice ||
                        "Tidak ada data",
                },
                {
                    label: "Status Kesehatan",
                    value:
                        physicalExaminations[0].health_status === 'tidak_sehat'
                            ? 'Tidak Sehat'
                            : physicalExaminations[0].health_status === 'sehat'
                                ? 'Sehat'
                                : 'Tidak ada data',
                },
            ]
            : [];

    // Update PropTypes
    ScreeningDetails.propTypes = {
        patient: PropTypes.shape({
            name: PropTypes.string.isRequired,
            age: PropTypes.number.isRequired,
            gender: PropTypes.string.isRequired,
            contact: PropTypes.string.isRequired,
            nik: PropTypes.string.isRequired,
            date_of_birth: PropTypes.string.isRequired,
        }).isRequired,
        questionsAndAnswers: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                question: PropTypes.string.isRequired,
                answer: PropTypes.string,
            })
        ).isRequired,
        queue: PropTypes.any, // Add more specific PropTypes if needed
    };

    // Update the health-check TabsContent section
    return (
        <SideBar header={`Detail kuesioner ${capitalizeWords(patient.name)}`}>
            <Head title={`Detail kuesioner ${capitalizeWords(patient.name)}`} />
            <Toaster position="top-center" />
            <Link href={route("paramedis.history")}>
                <Button variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
                </Button>
            </Link>
            <Tabs defaultValue="questionnaire">
                <TabsList className="grid grid-cols-3 mb-4 w-full">
                    <TabsTrigger value="questionnaire">Kuesioner</TabsTrigger>
                    <TabsTrigger value="personal-info">
                        Informasi Pasien
                    </TabsTrigger>
                    <TabsTrigger value="health-check">
                        Pemeriksaan Fisik
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="questionnaire">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex gap-2 items-center">
                                <FileText className="w-6 h-6" />
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
                                        <TableHead>NO</TableHead>
                                        <TableHead>Pertanyaan</TableHead>
                                        <TableHead>Jawaban</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {qaState.map((qa, index) => (
                                        <TableRow key={qa.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{qa.question}</TableCell>
                                            <TableCell>
                                                {qa.answer || "-"}
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
                            <CardTitle className="flex gap-2 items-center">
                                <User className="w-6 h-6" />
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
                                        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-muted">
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
                <TabsContent value="health-check">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex gap-2 items-center">
                                <User className="w-6 h-6" />
                                Informasi Pemeriksaan Fisik
                            </CardTitle>
                            <CardDescription>Detail Informasi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {healthcheckDetails.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4"
                                    >
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
    questionsAndAnswers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            question: PropTypes.string.isRequired,
            answer: PropTypes.string,
        })
    ).isRequired,
    queue: PropTypes.any, // Add more specific PropTypes if needed
};
