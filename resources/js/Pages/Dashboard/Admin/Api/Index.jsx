"use client";

import { useState } from "react";
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
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    CircleCheck,
} from "lucide-react";
import Sidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head, useForm } from "@inertiajs/react";
import { toast, Toaster } from "sonner";

export default function GeminiApiKey({ apikeys }) {
    const [apiKeyStatus, setApiKeyStatus] = useState("Not Set");
    const { data, setData, put, processing, errors } = useForm({
        api_key: "",
    });

    const saveApikey = (e) => {
        e.preventDefault();

        // Melakukan request PUT dengan Inertia.js
        put(route("apikey.update", 1), {
            onSuccess: () => {
                toast.success("API Key Berhasil Di Perbaharui");
                setApiKeyStatus("Active");
            },
            onError: (error) => {
                toast.error(
                    `Gagal memperbaharui API Key: ${
                        error.response?.data?.message || "Terjadi kesalahan!"
                    }`
                );
            },
        });
    };

    const handleTestApiKey = () => {
        setTimeout(() => {
            toast("Belum bisa digunakan", {
                icon: <CircleCheck className="h-4 w-4" />,
            });
        }, 1000);
    };

    return (
        <Sidebar>
            <Head title="Apikey" />
            <div className="container mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold mb-6">
                    Google Gemini AI API Key
                </h1>
                <Toaster position="top-center" />
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-6 w-6" />
                            Set Google Gemini AI API Key
                        </CardTitle>
                        <CardDescription>
                            Masukkan kunci API AI Google Gemini Anda untuk
                            mengaktifkan fitur AI
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
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
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-6 w-6" />
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
                                {/* Pastikan apikeys adalah objek dan tidak null */}
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
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6" />
                            Informasi Penting
                        </CardTitle>
                        <CardDescription>
                            Detail penting tentang penggunaan Google Gemini AI
                            API
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
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
