import React, { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Input } from "@/Components/ui/input";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Stethoscope, ArrowRight, CircleCheck, Book, BarChart, Users, UserCheck, UserX } from "lucide-react";
import ScreeningDialog from "./_components/PhysicalExamination";
import { Badge } from "@/Components/ui/badge";
import { toast, Toaster } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const StatisticCard = ({ icon: Icon, title, value, description, color }) => (
    <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`w-6 h-6 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const ScreeningOfflineIndex = ({ screenings = [] }) => {
    const { errors } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [examiningScreening, setExaminingScreening] = useState(null);
    const itemsPerPage = 10;

    const filtered = screenings.filter((screening) => {
        if (filter === "all") return true;
        if (filter === "online") {
            // Cek jika ada jawaban dan isOnline === 1
            return screening.answers?.[0]?.isOnline === 1;
        }
        if (filter === "offline") {
            // Cek jika ada jawaban dan isOnline === 0 atau undefined (untuk data lama)
            return screening.answers?.[0]?.isOnline === 0 || screening.answers?.[0]?.isOnline === undefined;
        }
        return true;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedScreenings = filtered.slice(
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

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            toast(flash.message, {
                icon: <CircleCheck className="w-5 h-5 text-green-500" />,
            });
        }
    }, [flash.message]);

    // Dummy data statistik, ganti dengan data asli jika sudah ada
    const stats = [
        {
            icon: Users,
            title: "Total Screening",
            value: "120",
            description: "Semua screening bulan ini",
            color: "text-blue-500",
        },
        {
            icon: UserCheck,
            title: "Screening Selesai",
            value: "80",
            description: "Sudah diperiksa",
            color: "text-green-500",
        },
        {
            icon: UserX,
            title: "Screening Pending",
            value: "40",
            description: "Belum diperiksa",
            color: "text-yellow-500",
        },
        {
            icon: BarChart,
            title: "Screening Online",
            value: "60",
            description: "Screening via online",
            color: "text-purple-500",
        },
    ];

    return (
        <ParamedisSidebar header={"Daftar Screening"}>
            <Head title="Screening Offline" />
            <Toaster position="top-center" />

            {/* Statistik Section */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <StatisticCard key={i} {...stat} />
                ))}
            </div> */}

            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Daftar Screening</CardTitle>
                    <div className="w-48">
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter Screening" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 mb-4 md:flex-row">
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
                                <TableHead>Jenis Screening</TableHead>
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
                                    <Badge variant={screening.answers?.[0]?.isOnline === 1 ? "default" : "secondary"}>
                                                {screening.answers?.[0]?.isOnline === 1
                                                    ? "Screening Online"
                                                    : "Screening Offline"}
                                            </Badge>
                                        </TableCell>
                                    <TableCell>
                                        <Link
                                            href={route("paramedis.detail", {
                                                uuid: screening.uuid,
                                            })}
                                        >
                                            <Button
                                                variant="outline"
                                                className="mb-4"
                                            >
                                                <Book className="mr-2 w-4 h-4" />{" "}
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
                                                <Stethoscope className="mr-2 w-4 h-4" />
                                                Health Check
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filtered.length > 0 && totalPages > 1 && (
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
                    )}

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
