import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import PaginationComponent from "../_components/pagination";

export default function PatientsList({ patients }) {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <DoctorSidebar header={"Screening"}>
            <Head title="Screening" />
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pasien Klinik Gunung</CardTitle>
                </CardHeader>
                <CardContent>
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
                                <TableHead>No</TableHead>
                                <TableHead>Nama Pasien</TableHead>
                                <TableHead>Umur</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients && patients.data.length > 0 ? (
                                patients.data.map((patient, index) => (
                                    <TableRow key={patient.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{patient.name}</TableCell>
                                        <TableCell>{patient.age}</TableCell>
                                        <TableCell>Detail</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center">
                                        Belum Ada Daftar Pasien.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Show pagination if there are patients */}
                    {patients && patients.data.length > 0 && <PaginationComponent data={patients} />}
                </CardContent>
            </Card>
        </DoctorSidebar>
    );
}
