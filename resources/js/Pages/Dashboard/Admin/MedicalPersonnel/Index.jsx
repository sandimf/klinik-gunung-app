import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Toaster } from "sonner";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Search, UserPlus } from "lucide-react";
import ChangePasswordDialog from "./_components/ChangePasswordDialog"

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

export default function Index({ users }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminSidebar header="Daftar Staff">
            <Head title="Daftar Staff" />
            <div className="">
                <Toaster position="top-center" />
                <div className="flex justify-between items-center mb-6">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari staff..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-[300px]"
                        />
                    </div>
                    <Link href={route("staff.create")}>
                        <Button>
                            <UserPlus className="mr-2 w-4 h-4" />
                            Tambah Staff Baru
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                        <CardTitle className="text-2xl font-bold">
                            Daftar Staff Klinik
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>
                                Daftar staff klinik yang terdaftar.
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Nama Staff</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>NIK</TableHead>
                                    <TableHead>Telepon</TableHead>
                                    <TableHead>Peran</TableHead>
                                    <TableHead>Tanggal Pendaftaran</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.uuid}>
                                        <TableCell>
                                            {filteredUsers.indexOf(user) + 1}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.nik}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.role === "admin"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {user.role === "admin" ? "master" : user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatTanggalIndo(user.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedUserId(user.id)
                                                    setOpenDialog(true)
                                                }}
                                                
                                            >
                                                Ubah Password
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <ChangePasswordDialog
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    userId={selectedUserId}
                />
            </div>
        </AdminSidebar>
    );
}
