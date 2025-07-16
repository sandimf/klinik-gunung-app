import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Search, UserPlus, Pencil, Signature } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

export default function Index({ users, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("staff.index"), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Pagination handler
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, { search: searchTerm }, { preserveState: true, replace: true });
        }
    };

    const [selectedSignature, setSelectedSignature] = useState(null);

    return (
        <AdminSidebar header="Daftar Staff">
            <Head title="Daftar Staff" />
            {/* Judul utama */}
            <h2 className="text-2xl font-bold tracking-tight mb-2">Daftar Staff Klinik</h2>
            <p className="text-muted-foreground mb-2">Daftar seluruh staff klinik yang terdaftar.</p>
            {/* Baris search dan tambah staff */}
            <div className="flex items-center py-4 gap-4 mb-4">
                <form onSubmit={handleSearch} className="flex gap-2 flex-grow">
                    <Input
                        type="text"
                        placeholder="Cari staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm w-full"
                    />
                    <Button variant="ghost" type="submit">
                        <Search />
                    </Button>
                </form>
                <div className="flex-shrink-0">
                    <Link href={route("staff.create")}>
                        <Button>
                            <UserPlus className="mr-2 w-4 h-4" />
                            Tambah Staff Baru
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Table tanpa Card */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama Staff</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>NIK</TableHead>
                            <TableHead>Telepon</TableHead>
                            <TableHead>Peran</TableHead>
                            <TableHead>Tanggal Pendaftaran</TableHead>
                            <TableHead>Signature</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data && users.data.length > 0 ? (
                            users.data.map((user, idx) => (
                                <TableRow key={user.uuid}>
                                    <TableCell>{(users.current_page - 1) * users.per_page + idx + 1}</TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.nik}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                            {user.role === "admin" ? "master" : user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatTanggalIndo(user.created_at)}</TableCell>
                                    <TableCell>
                                        {user.signature ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedSignature(user.signature)}
                                                    >
                                                        <Signature />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Tanda Tangan Digital</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="flex justify-center items-center py-4 bg-white">
                                                        <img
                                                            src={selectedSignature}
                                                            alt="Signature"
                                                            className="rounded"
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    Belum ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination di bawah table */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-muted-foreground text-sm">
                    Page {users.current_page} of {users.last_page}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(users.prev_page_url)}
                        disabled={!users.prev_page_url}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(users.next_page_url)}
                        disabled={!users.next_page_url}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </AdminSidebar>
    );
}

function formatTanggalIndo(dateString) {
    if (!dateString) return "";
    const bulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const date = new Date(dateString);
    const tgl = date.getDate();
    const bln = bulan[date.getMonth()];
    const thn = date.getFullYear();
    return `${tgl} ${bln} ${thn}`;
}
