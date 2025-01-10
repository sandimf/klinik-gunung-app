import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import ManagerSidebar from "@/Layouts/Dashboard/ManagerSidebarLayout";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import MedicalHeader from "../_components/table-header";
import { Badge } from "@/Components/ui/badge";

const ScreeningOfflineIndex = ({ screenings = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");

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
        <ManagerSidebar header={"Aktivitas Screening"}>
            <Head title="Aktivitas Screening" />
            <MedicalHeader title="Aktivitas Screening" />
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Input
                    placeholder="Cari nama pasien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nomor Antrian</TableHead>
                        <TableHead>Nama Pasien</TableHead>
                        <TableHead>Screening type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Status Pembayaran</TableHead>
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
                                {screening.answers[0]?.isOnline === true
                                    ? "Online"
                                    : "Offline"}
                            </TableCell>
                            <TableCell>
                                <Badge>{screening.screening_status}</Badge>
                            </TableCell>
                            <TableCell>{screening.payment_status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ManagerSidebar>
    );
};

export default ScreeningOfflineIndex;
