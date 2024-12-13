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
import { Stethoscope, ArrowRight } from "lucide-react";
import ScreeningDialog from "./Partials/PhysicalExaminationOnline";
import { Badge } from "@/Components/ui/badge";

const ScreeningOfflineIndex = ({ screenings = [] }) => {
    const { errors } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("completed");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [examiningScreening, setExaminingScreening] = useState(null);
    const itemsPerPage = 10;

    const filteredScreenings = screenings.filter(
        (screening) =>
            screening.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedType === "completed" || screening.type === selectedType)
    );
    
    const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);
    const paginatedScreenings = filteredScreenings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handleExamine = (screening) => {
        setExaminingScreening(screening);
        setIsDialogOpen(true);
    };
    const handleDialogSuccess = () => {
        setIsDialogOpen(false);
        setExaminingScreening(null);
    };

    return (
        <ParamedisSidebar header={"Daftar Screening Online"}>
            <Head title="Daftar Screening Online" />
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Screening Online</CardTitle>
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
                                <SelectItem value="completed">Semua</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nomor Antrian</TableHead>
                                <TableHead>Nama Pasien</TableHead>
                                <TableHead>Kuesioner</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedScreenings.map((screening) => (
                                
                                <TableRow key={screening.id}>
                                    <TableCell>
                                        {screening.answers[0].queue}
                                    </TableCell>
                                    <TableCell>{screening.name}</TableCell>
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
                                                <ArrowRight className="mr-2 h-4 w-4" />{" "}
                                                Kuesioner
                                            </Button>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {screening.screening_status ===
                                        "completed" ? (
                                            <Badge>
                                                {screening.screening_status}
                                            </Badge>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    handleExamine(screening)
                                                }
                                            >
                                                <Stethoscope className="h-4 w-4 mr-2" />
                                                Health Check
                                            </Button>
                                        )}
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
