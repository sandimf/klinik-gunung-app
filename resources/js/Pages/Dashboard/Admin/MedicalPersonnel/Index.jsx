import { Card,CardHeader,CardTitle,CardContent } from "@/Components/ui/card";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { PlusIcon } from "lucide-react";
import MedicalHeader from './_components/table-header';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
export default function Index({ users }) {
    return (
        <AdminSidebar header={'Daftar Tenaga Medis'}>
            <Head title="Daftar Tenaga Medis" />
            <MedicalHeader
                routeName={route('users.create')}
            />
                    <Table>
                        <TableCaption>
                        </TableCaption>
                        <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Tenaga Medis</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Nik</TableHead>
                                    <TableHead>Telepon</TableHead>
                                    <TableHead>Peran</TableHead>
                                    <TableHead>Tanggal Dibuat</TableHead>
                                </TableRow>
                        </TableHeader>
                        <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.nik}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
        </AdminSidebar>
    );
}
