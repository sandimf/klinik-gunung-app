import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Sidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head, useForm } from "@inertiajs/react";
import { Contact, CheckCircle2 } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function GeminiApiKey({ emergencyContacts }) {
    const { data, setData, put, processing, errors } = useForm({
        name: "",
        contact: "",
    });

    const saveContact = (e) => {
        e.preventDefault();

        put(route("emergecy-contact.update", 1), {
            onSuccess: () => {
                toast.success("Kontak darurat berhasil disimpan", {
                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
                });
            },
            onError: (error) => {
                if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.errors
                ) {
                    Object.values(error.response.data.errors).forEach(
                        (messages) => {
                            messages.forEach((message) => {
                                toast.error(message);
                            });
                        }
                    );
                } else {
                    toast.error("Emergency contact gagal disimpan");
                }
            },
        });
    };

    return (
        <Sidebar header={"Kontak Darurat"}>
            <Head title="Kontak Darurat" />
            <div className="container p-6 mx-auto space-y-6">
                <h1 className="mb-6 text-3xl font-bold">Kontak Darurat</h1>
                <Toaster  position="top-center" />
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                            <Contact className="w-6 h-6" />
                            Informasi Kontak Darurat
                        </CardTitle>
                        <CardDescription>
                            Informasi kontak darurat untuk di tampilkan di
                            dashboard pasien.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 items-center w-full">
                            <div className="flex flex-col space-y-1.5 mb-4">
                                <Label htmlFor="name">Nama Kontak</Label>
                                <Input
                                    id="name"
                                    placeholder="Nama Pihak/Layanan Darurat"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    type="text"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="contact">Nomor Kontak</Label>
                                <Input
                                    id="contact"
                                    placeholder="08XXXXXXXXXX"
                                    value={data.contact}
                                    onChange={(e) =>
                                        setData("contact", e.target.value)
                                    }
                                    type="text"
                                />
                                {errors.contact && (
                                    <p className="text-sm text-red-600">
                                        {errors.contact}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            disabled={processing}
                            onClick={saveContact}
                        >
                            Simpan Kontak
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                            Nomor Kontak Darurat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kontak</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {emergencyContacts.map((emergencyContact) => (
                                    <TableRow key={emergencyContact.id}>
                                        <TableCell>
                                            {emergencyContact.name}
                                        </TableCell>
                                        <TableCell>
                                            {emergencyContact.contact}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Sidebar>
    );
}
