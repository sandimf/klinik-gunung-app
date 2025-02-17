import { Card,CardHeader,CardTitle,CardContent } from "@/Components/ui/card";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";


export default function Index({ users }) {
    return (
        <AdminSidebar header={'Daftar Tenaga Medis'}>
            <Head title="Daftar Tenaga Medis" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Daftar Tenaga Medis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Nama Tenaga Medis</TableHead>
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
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </AdminSidebar>
    );
}
