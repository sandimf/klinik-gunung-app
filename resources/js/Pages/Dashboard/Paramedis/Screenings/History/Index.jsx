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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Eye } from 'lucide-react';
import ScreeningDialog from "../Offline/Partials/PhysicalExamination";
import { Badge } from "@/Components/ui/badge";

const ScreeningOfflineIndex = ({ screenings = [] }) => {
    const { errors } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [examiningScreening, setExaminingScreening] = useState(null);
    const itemsPerPage = 10;

    const filteredScreenings = screenings.filter((screening) => {
        const nameMatch = screening.name.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = selectedType === "all" || 
            (selectedType === "online" && screening.answers[0]?.isOnline === true) ||
            (selectedType === "offline" && (screening.answers[0]?.isOnline === false || screening.answers[0]?.isOnline === undefined));
        return nameMatch && typeMatch;
    });

    const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);
    const paginatedScreenings = filteredScreenings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDialogSuccess = () => {
        setIsDialogOpen(false);
        setExaminingScreening(null);
    };

    const capitalizeWords = (str) => {
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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
                                <TableHead>Detail</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedScreenings.map((screening, index) => (
                                <TableRow key={`${screening.id}-${index}`}>
                                    <TableCell>
                                        {screening.answers[0]?.queue || 'N/A'}
                                    </TableCell>
                                    <TableCell className="font-bold">{capitalizeWords(screening.name)}</TableCell>
                                    <TableCell>
                                        {screening.answers[0]?.isOnline === true ? 'Online' : 'Offline'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge>{screening.screening_status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={route("paramedis.detail", {
                                                id: screening.id,
                                            })}
                                        >
                                            <Button
                                                variant="outline"
                                                className="mb-4"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />{" "}
                                                Kuesioner
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    <ScreeningDialog
                        isOpen={isDialogOpen}
                        setIsOpen={setIsDialogOpen}
                        onSuccess={handleDialogSuccess}
                        examiningScreening={examiningScreening}
                        errors={errors}
                    />
                </CardContent>
            </Card>
        </ParamedisSidebar>
    );
};

export default ScreeningOfflineIndex;

