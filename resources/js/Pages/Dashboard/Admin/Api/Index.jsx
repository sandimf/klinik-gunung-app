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
import { Key, RefreshCw, AlertTriangle, CheckCircle, Info } from "lucide-react";
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
            toast('Belum bisa digunakan', {
              icon: <Info className="h-4 w-4"/>
            });
        }, 1000);
    };

    return (
        <Sidebar>
            <Head title="Apikey" />
            <div className="container mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold mb-6">
                    Google Gemini AI API Key Management
                </h1>
                <Toaster position="top-center" />
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-6 w-6" />
                            Set Google Gemini AI API Key
                        </CardTitle>
                        <CardDescription>
                            Enter your Google Gemini AI API key to enable AI
                            features
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="apiKey">API Key</Label>
                                <Input
                                    id="apiKey"
                                    placeholder="Enter your Gemini AI API key"
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
                            Save API Key
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
                            Current status of your Gemini AI API key
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead>ApiKey</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                                <TableBody>
                                    {/* Pastikan apikeys adalah objek dan tidak null */}
                                    {apikeys ? (
                                        <TableRow key={apikeys.id}>
                                            <TableCell>
                                            {new Date(apikeys.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
          {/* Menampilkan 3 karakter pertama dan 3 karakter terakhir dari api_key */}
          {apikeys.api_key ? `${apikeys.api_key.slice(0, 3)}...${apikeys.api_key.slice(-3)}` : 'No API Key'}
        </TableCell>
                                            {/* Menampilkan api_key */}
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mr-2"
                                                    onClick={handleTestApiKey}
                                                    disable
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Test Key
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                No API keys found
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
                            Important Information
                        </CardTitle>
                        <CardDescription>
                            Key details about using the Google Gemini AI API
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Keep your API key confidential and secure.</li>
                            <li>
                                Do not share your API key in public repositories
                                or client-side code.
                            </li>
                            <li>
                                Regularly rotate your API key for enhanced
                                security.
                            </li>
                            <li>
                                Monitor your API usage to stay within quota
                                limits.
                            </li>
                            <li>
                                Refer to the Google Gemini AI documentation for
                                best practices and usage guidelines.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </Sidebar>
    );
}
