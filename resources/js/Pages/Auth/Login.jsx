import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import AuthLayout from "@/Layouts/Auth/AuthLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function Component({ social, status, canResetPassword = true }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AuthLayout>
            <Head title="Login" />
            <div className="relative mx-auto w-full max-w-sm">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Masuk</CardTitle>
                        <CardDescription>
                            Masukkan email Anda di bawah ini untuk login ke akun
                            Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="johndoe@example.com"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm underline"
                                        >
                                            Lupa Password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        placeholder="password"
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
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
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
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing ? "Sedang Masuk..." : "Masuk"}
                            </Button>
                        </form>
                        {social.google === 1 && (
                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                onClick={() => {
                                    window.location.href =
                                        "/auth/google/redirect";
                                }}
                            >
                                Login with Google
                            </Button>
                        )}
                        <div className="mt-4 text-sm text-center">
                            Belum Memiliki Akun?{" "}
                            <Link
                                href={route("register")}
                                className="underline"
                            >
                                Buat Akun
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <div className="absolute right-0 bottom-0 -mb-6 text-xs text-gray-500">
                    v0.1
                </div>
            </div>
        </AuthLayout>
    );
}
