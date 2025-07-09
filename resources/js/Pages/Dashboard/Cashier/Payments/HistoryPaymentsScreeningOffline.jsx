import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Toaster } from "sonner";
import { Notebook } from "lucide-react";
import { Button } from "@/Components/ui/button";

const ScreeningOfflineIndex = ({ patients = [], medicines }) => {
    console.log(medicines);
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredpatients = patients.filter((screening) =>
        screening.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredpatients.length / itemsPerPage);
    const paginatedpatients = filteredpatients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    return (
        <CashierSidebar header={"Riwayat Pembayaran Screening"}>
            <Head title="Riwayat Pembayaran Screening" />
            <Toaster />
            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Pembayaran Screening</CardTitle>
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
                                <TableHead>Nomor</TableHead>
                                <TableHead>Nomor Transaksi</TableHead>
                                <TableHead>Nama Pasien</TableHead>
                                <TableHead>Metode Pembayaran</TableHead>
                                <TableHead>Jumlah Pembayaran</TableHead>
                                <TableHead>Status Pembayaran</TableHead>
                                <TableHead>Sertifikat</TableHead>
                                <TableHead>Nota</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedpatients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-500">
                                        Belum ada data
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedpatients.map((patients, idx) => (
                                    <TableRow key={patients.id}>
                                        <TableCell>
                                            {(currentPage - 1) * itemsPerPage + idx + 1}
                                        </TableCell>
                                        <TableCell>
                                            {patients.payments[0].no_transaction}
                                        </TableCell>
                                        <TableCell>
                                            {capitalizeFirstLetter(patients.name)}
                                        </TableCell>
                                        <TableCell>
                                            {capitalizeFirstLetter(
                                                patients.payments[0]?.payment_method || ""
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {patients.payments[0]?.amount_paid}
                                        </TableCell>
                                        <TableCell>
                                            <Badge>
                                                {capitalizeFirstLetter(
                                                    patients.payment_status || ""
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                    <a
                                        href={route(
                                            "pdf.healthcheck.paramedis",
                                            patients.id
                                        )}
                                    >
                                        <Button>
                                            <Printer />
                                        </Button>
                                    </a>
                                </TableCell>
                                        <TableCell>
                                            <a href={route('generate.nota.ts', patients.payments[0].no_transaction)}>
                                                <Button>
                                                    <Notebook />
                                                </Button>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {filteredpatients.length > 0 && (
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
                </CardContent>
            </Card>
        </CashierSidebar>
    );
};

export default ScreeningOfflineIndex;
