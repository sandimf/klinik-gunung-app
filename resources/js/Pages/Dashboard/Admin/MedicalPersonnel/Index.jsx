import { Card,CardHeader,CardTitle,CardContent } from "@/Components/ui/card";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { PlusIcon } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
export default function Index({ users }) {
    return (
        <AdminSidebar header={'Daftar Tenaga Medis'}>
            <Head title="Daftar Tenaga Medis" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Daftar Tenaga Medis
                    </CardTitle>
                    {/* <Link href={route("users.create")}>
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Tambah Tenaga Medis
                        </Button>
                    </Link> */}
                </CardHeader>
                <CardContent>
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
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </AdminSidebar>
    );
}
