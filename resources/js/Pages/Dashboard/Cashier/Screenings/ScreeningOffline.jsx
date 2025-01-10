import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/Components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from '@/Components/ui/button';
import { CreditCard, ArrowRight } from 'lucide-react';
import PaymentDialog from './Payments/OfflinePayments';
import { Toaster } from 'sonner';

const ScreeningOfflineIndex = ({ screenings = [], medicines }) => {
    console.log(medicines);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [paymentScreening, setPaymentScreening] = useState(null);
    const itemsPerPage = 10;

    const filteredScreenings = screenings.filter(screening =>
        screening.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);
    const paginatedScreenings = filteredScreenings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePayment = (screening) => {
        setPaymentScreening(screening);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setPaymentScreening(null);
    };

    return (
        <CashierSidebar header={'Daftar Screening Offline'}>
            <Head title="Screening Offline" />
            <Toaster position='top-center' />
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pembayaran Screening Offline</CardTitle>
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
                                <TableHead>Nomor Antrian</TableHead>
                                <TableHead>Nama Pasien</TableHead>
                                <TableHead>NIK</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedScreenings.map((screening) => (
                                <TableRow key={screening.id}>
                                    <TableCell>{screening.answers[0]?.queue}</TableCell>
                                    <TableCell>{screening.name}</TableCell>
                                    <TableCell>{screening.nik}</TableCell>
                                    <TableCell>{screening.email}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handlePayment(screening)}>
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Bayar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                <PaymentDialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                screening={paymentScreening}
                medicines={medicines} // pass medicines here
            />
                </CardContent>
            </Card>
        </CashierSidebar>
    );
};

export default ScreeningOfflineIndex;
