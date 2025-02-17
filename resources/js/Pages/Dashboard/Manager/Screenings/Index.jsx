import { useState, useEffect } from "react";
import Sidebar from "@/Layouts/Dashboard/ManagerSidebarLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Printer } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";

export default function Report({
    totalPatients,
    sickPatientsCount,
    patients,
    totalParamedis,
    needPatientsCount,
    healthyPatientsCount,
    currentFilter,
}) {
    const user = usePage().props.auth.user;
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPatients, setFilteredPatients] = useState(patients);
    const [filter, setFilter] = useState(currentFilter || "all");
    const [selectedFilter, setSelectedFilter] = useState(
        currentFilter || "all"
    );
    useEffect(() => {
        const results = patients.filter(
            (patient) =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.health_status
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                patient.examined_by
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(results);
    }, [searchTerm, patients]);

    const handleFilterChange = (value) => {
        setFilter(value);
        window.location.href = route("manager.screening", { filter: value });
    };

    return (
        <Sidebar header={"Laporan"}>
            <Head title="Laporan Paramedis" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 no-print">
                    <h1 className="text-2xl font-bold">
                        Aktivitas Pemeriksaan Fisik
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Select
                            value={filter}
                            onValueChange={handleFilterChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                        <a
                            href={route("pdf.activity.manager", {
                                filter: selectedFilter,
                            })}
                        >
                            <Button variant="outline">
                                <Printer className="mr-2 h-4 w-4" /> Download
                                PDF
                            </Button>
                        </a>
                    </div>
                </div>
                <div className="space-y-6 no-print">
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Pemeriksaan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalPatients}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Pemeriksaan oleh Paramedis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalPatients}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Jumlah Pasien Sehat
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {healthyPatientsCount}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Jumlah Pasien Membutuhkan Dokter
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {sickPatientsCount}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Jumlah Pasien Membutuhkan Pendamping
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {needPatientsCount}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Jumlah Paramedis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalParamedis}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-5 w-5 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Cari pasien, status kesehatan, atau pemeriksa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-sm"
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Pasien</TableHead>
                            <TableHead>Tanggal Lahir</TableHead>
                            <TableHead>Status Kesehatan</TableHead>
                            <TableHead>Pemeriksa</TableHead>
                            <TableHead>Tanggal Pemeriksaan</TableHead>
                            <TableHead>Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatients.map((patient, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {patient.name}
                                </TableCell>
                                <TableCell>{patient.date_of_birth}</TableCell>
                                <TableCell>
                                    <Badge>
                                        {patient.health_status === "healthy"
                                            ? "Sehat"
                                            : patient.health_status ===
                                              "butuh_dokter"
                                            ? "Membutuhkan Dokter"
                                            : patient.health_status ===
                                              "butuh_pendamping"
                                            ? "Membutuhkan Pendamping"
                                            : "Status Tidak Diketahui"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{patient.examined_by}</TableCell>
                                <TableCell>{patient.examined_at}</TableCell>
                                <TableCell>
                                    <a
                                        href={route(
                                            "pdf.activity.manager",
                                            patient.id
                                        )}
                                    >
                                        <Button>
                                            <Printer />
                                        </Button>
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Sidebar>
    );
}
