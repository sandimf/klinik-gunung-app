import { useState, useEffect } from "react";
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
import {
    Key,
    AlertTriangle,
    CheckCircle,
    CheckCircle2,
} from "lucide-react";
import Sidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head, useForm } from "@inertiajs/react";

export default function GeminiApiKey({ apikeys, errors }) {
    const [setApiKeyStatus] = useState("Not Set");
    const { data, setData, put, processing } = useForm({
        api_key: "",
    });

    useEffect(() => {
        if (errors?.api_key) {
            // Coba ambil error validasi dari response
            const apiKeyError =
                error?.response?.data?.message ||
                "Terjadi kesalahan!";

            // Tidak perlu menampilkan toast di sini, karena akan ditangani oleh FlashToast global
        }
    }, [errors?.api_key]);

    const saveApikey = (e) => {
        e.preventDefault();

        put(route("apikey.update", 1), {
            onSuccess: () => {
                setApiKeyStatus("Active");
            },
            onError: (error) => {
                // Coba ambil error validasi dari response
                const apiKeyError =
                    error?.response?.data?.message ||
                    "Terjadi kesalahan!";

                // Tidak perlu menampilkan toast di sini, karena akan ditangani oleh FlashToast global
            },
        });
    };

    return (
        <Sidebar header={"Apikey"}>
            <Head title="Apikey" />
            <div className="container p-6 mx-auto space-y-6">
                <h1 className="mb-6 text-3xl font-bold">API KEY</h1>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                            <Key className="w-6 h-6" />
                            Google Gemini API KEY
                        </CardTitle>
                        <CardDescription>
                            Untuk mengaktifkan fitur scan KTP, mohon masukkan
                            kunci API Google Gemini Anda.
                            <a
                                className="text-blue-400"
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                            >
                                Dapatkan Kunci API di sini.
                            </a>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 items-center w-full">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="apiKey">API Key</Label>
                                <Input
                                    id="apiKey"
                                    placeholder="Masukkan kunci API Gemini AI Anda"
                                    value={data.apiKey}
                                    onChange={(e) =>
                                        setData("api_key", e.target.value)
                                    }
                                    type="text"
                                />
                                {errors.apiKey && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.apiKey}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            disable={processing}
                            onClick={saveApikey}
                        >
                            Simpan Api Key
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                            <CheckCircle className="w-6 h-6" />
                            API Key Status
                        </CardTitle>
                        <CardDescription>
                            Status kunci API Gemini AI Anda saat ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Terakhir Diperbarui</TableHead>
                                    <TableHead>ApiKey</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apikeys ? (
                                    <TableRow key={apikeys.id}>
                                        <TableCell>
                                            {new Date(
                                                apikeys.created_at
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {/* Menampilkan 3 karakter pertama dan 3 karakter terakhir dari api_key */}
                                            {apikeys.api_key
                                                ? `${apikeys.api_key.slice(
                                                      0,
                                                      3
                                                  )}...${apikeys.api_key.slice(
                                                      -3
                                                  )}`
                                                : "No API Key"}
                                        </TableCell>
                                        {/* Menampilkan api_key */}
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            Tidak ada kunci API yang ditemukan
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                            <AlertTriangle className="w-6 h-6" />
                            Informasi Penting
                        </CardTitle>
                        <CardDescription>
                            Detail penting tentang penggunaan Google Gemini AI
                            API
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="pl-5 space-y-2 list-disc">
                            <li>
                                Jaga kerahasiaan dan keamanan kunci API Anda.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </Sidebar>
    );
}
