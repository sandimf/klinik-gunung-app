"use client";

import { FormEventHandler, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/Layouts/Auth/AuthLayout";

export default function Component({ social }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        role: "patients",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    return (
        <AuthLayout
            title="Buat Akun Baru"
            description="Masukkan detail di bawah untuk membuat akun Anda"
        >
            <Head title="Buat Akun" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            placeholder="Nama"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="nama@email.com"
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            placeholder="********"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 px-3 py-2 h-full hover:bg-transparent"
                            onClick={togglePasswordVisibility}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                        Konfirmasi Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={
                                showPasswordConfirmation ? "text" : "password"
                            }
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="********"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 px-3 py-2 h-full hover:bg-transparent"
                            onClick={togglePasswordConfirmationVisibility}
                            aria-label={
                                showPasswordConfirmation
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPasswordConfirmation ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-sm text-red-500">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? "Membuat Akun..." : "Buat Akun"}
                </Button>
            </form>
            {social.google === 1 && (
                <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => {
                        window.location.href = "/auth/google/redirect";
                    }}
                >
                    Buat Akun dengan Google
                </Button>
            )}
            <div className="mt-4 text-sm text-center">
                Sudah punya akun?{" "}
                <Link href={route("login")} className="underline">
                    Masuk
                </Link>
            </div>
        </AuthLayout>
    );
}
