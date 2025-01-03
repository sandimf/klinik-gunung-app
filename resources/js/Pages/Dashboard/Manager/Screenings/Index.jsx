import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

const ScreeningOfflineIndex = ({ screenings = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    const capitalizeWords = (str) => {
        return str
            .split(" ")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
    };

    return (
        <ParamedisSidebar header={"Riwayat Pemeriksaan"}>
            <Head title="Riwayat Pemeriksaan" />
            <Card>
                <CardHeader>
                    <CardTitle>Riawayat Pemeriksaan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <Input
                            placeholder="Cari nama pasien..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select
                            value={selectedType}
                            onValueChange={setSelectedType}
                        >
                            <SelectTrigger className="max-w-[180px]">
                                <SelectValue placeholder="Pilih tipe screening" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="offline">Offline</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nomor Antrian</TableHead>
                                <TableHead>Nama Pasien</TableHead>
                                <TableHead>Screening type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Pemeriksaan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
    {screenings.map((screening, index) => (
        <TableRow key={`${screening.id}-${index}`}>
            <TableCell>
                {screening.answers[0]?.queue || "N/A"}
            </TableCell>
            <TableCell className="font-bold">
                {capitalizeWords(screening.name)}
            </TableCell>
            <TableCell>
                {screening.answers[0]?.isOnline === true ? "Online" : "Offline"}
            </TableCell>
            <TableCell>
                <Badge>
                    {screening.screening_status}
                </Badge>
            </TableCell>
            <TableCell>
                {/* Check if physical_examinations exists and if it's not empty */}
                {screening.physicalExaminations && screening.physicalExaminations.length > 0 ? (
                    // Access the first item in the physicalExaminations array
                    <>
                        {screening.physicalExaminations[0].paramedis ? (
                            `Paramedis: ${screening.physicalExaminations[0].paramedis.name}`
                        ) : screening.physicalExaminations[0].doctor ? (
                            `Dokter: ${screening.physicalExaminations[0].doctor.name}`
                        ) : (
                            "Tidak ada pemeriksaan"
                        )}
                    </>
                ) : (
                    "Tidak ada pemeriksaan"
                )}
            </TableCell>
        </TableRow>
    ))}
</TableBody>

                    </Table>
                </CardContent>
            </Card>
        </ParamedisSidebar>
    );
};

export default ScreeningOfflineIndex;
