import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

export default function Index({ users }) {
    return (
        <AdminSidebar header={"Daftar Staff"}>
            <Head title="Daftar Staff" />
            <Card>
                <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                    <CardTitle className="text-2xl font-bold">
                        Daftar Staff
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama Staff</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Nik</TableHead>
                                <TableHead>Telepon</TableHead>
                                <TableHead>Peran</TableHead>
                                <TableHead>Tanggal Dibuat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.nik}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminSidebar>
    );
}
