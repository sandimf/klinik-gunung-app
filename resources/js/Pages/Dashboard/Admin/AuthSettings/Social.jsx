import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Switch } from "@/Components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Facebook, Instagram, Save, Settings } from "lucide-react";
import Sidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { useForm, Head } from "@inertiajs/react";
import { toast, Toaster } from "sonner";

export default function SocialMediaLogin({ initialData }) {
    const { data, setData, put, processing } = useForm({
        google: initialData.google || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("auth-settings.update", 1), {
            onSuccess: () => {
                toast.success("Pengaturan login sosial berhasil diperbarui");
            },
            onError: (errors) => {
                toast.error(
                    "Gagal memperbarui pengaturan login sosial",
                    errors
                );
            },
        });
    };

    return (
        <Sidebar header={"Social Login"}>
            <Head title="Social Login" />
            <div className="container p-6 mx-auto space-y-6">
                <h1 className="mb-6 text-3xl font-bold">
                    Pengaturan Masuk Media Sosial
                </h1>
                <Toaster position="top-center" />
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                            <Settings className="w-6 h-6" />
                            Kelola Opsi Masuk Media Sosial
                        </CardTitle>
                        <CardDescription>
                            Mengaktifkan atau menonaktifkan metode login media
                            sosial untuk aplikasi Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Penyedia</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        <div className="flex gap-2 items-center">
                                            <svg
                                                className="w-5 h-5"
                                                viewBox="-3 0 262 262"
                                                xmlns="http://www.w3.org/2000/svg"
                                                preserveAspectRatio="xMidYMid"
                                            >
                                                <path
                                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                                    fill="#EB4335"
                                                />
                                            </svg>
                                            Google
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full ${
                                                data.google
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            } px-2.5 py-0.5 text-xs font-medium`}
                                        >
                                            {data.google
                                                ? "Enabled"
                                                : "Disabled"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            id="google-login"
                                            checked={data.google}
                                            onCheckedChange={(checked) =>
                                                setData("google", checked)
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        <div className="flex gap-2 items-center">
                                            <Facebook className="w-5 h-5 text-blue-600" />
                                            Facebook
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full ${
                                                data.facebook
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            } px-2.5 py-0.5 text-xs font-medium`}
                                        >
                                            {data.facebook
                                                ? "Enabled"
                                                : "Disabled"}
                                        </span>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        <div className="flex gap-2 items-center">
                                            <Instagram className="w-5 h-5 text-pink-600" />
                                            Instagram
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full ${
                                                data.instagram
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            } px-2.5 py-0.5 text-xs font-medium`}
                                        >
                                            {data.instagram
                                                ? "Enabled"
                                                : "Disabled"}
                                        </span>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            <Save className="mr-2 w-4 h-4" />
                            Submit
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </Sidebar>
    );
}
