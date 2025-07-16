import React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import {
    RefreshCw,
    Eye,
    EyeOff,
} from "lucide-react";
import SignatureInput from '@/Components/ui/signature-input'
import { Calendar } from "@/Components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

function DatePicker({ value, onChange, error }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`w-full pl-3 text-left font-normal ${!value ? "text-muted-foreground" : ""}`}
                    type="button"
                >
                    {value ? format(new Date(value), "PPP") : <span>Pilih tanggal</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    onSelect={date => {
                        if (date) {
                            // Format ke YYYY-MM-DD agar cocok dengan backend
                            const iso = date.toISOString().slice(0, 10);
                            onChange(iso);
                            setOpen(false);
                        }
                    }}
                    captionLayout="dropdown"
                />
            </PopoverContent>
        </Popover>
    );
}

export default function CreatePersonal() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [signature, setSignature] = React.useState("");
    const canvasRef = React.useRef();
    const initialData = {
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        address: "",
        nik: "",
        date_of_birth: "",
        signature: "",
    };

    const generatePassword = () => {
        const length = 12;
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let newPassword = "";
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(
                Math.floor(Math.random() * charset.length)
            );
        }
        setData("password", newPassword);
        setConfirmPassword(newPassword);
    };

    const { data, setData, post, processing, errors } = useForm(initialData);

    React.useEffect(() => {
        setData("signature", signature);
    }, [signature]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setData("signature", signature); // pastikan signature di-set
        post(route("staff.store"), {
            onSuccess: () => setData(initialData),
            onError: (errors) => {
                // Jika errors adalah objek atau array, kamu bisa tampilkan pesan pertama atau semua pesan
                const errorMessage = Array.isArray(errors)
                    ? errors.join(", ")
                    : errors?.message || "Terjadi kesalahan, coba lagi!";
            },
        });
    };

    return (
        <AdminSidebar header="Staff">
            <Head title="Staff" />
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Tambah Staff
                    </CardTitle>
                    <CardDescription>
                        Silakan isi form di bawah ini untuk menambah tenaga
                        medis baru.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Nama Lengkap */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.name && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* NIK */}
                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    type="text"
                                    name="nik"
                                    value={data.nik}
                                    onChange={(e) =>
                                        setData("nik", e.target.value)
                                    }
                                    placeholder="Masukkan NIK"
                                />
                                {errors.nik && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.nik}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="contoh@email.com"
                                />
                                {errors.email && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Tanggal Lahir */}
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth" className="block text-sm font-medium">
                                    Tanggal Lahir
                                </Label>
                                <DatePicker
                                    value={data.date_of_birth}
                                    onChange={val => setData("date_of_birth", val)}
                                    error={errors.date_of_birth}
                                />
                                {errors.date_of_birth && (
                                    <p className="text-sm text-red-500" role="alert">
                                        {errors.date_of_birth}
                                    </p>
                                )}
                            </div>

                            {/* Alamat */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    placeholder="Masukkan alamat"
                                />
                                {errors.address && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* Nomor Telepon */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    placeholder="Masukkan nomor telepon"
                                />
                                {errors.phone && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Masukkan password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="flex absolute inset-y-0 right-0 items-center pr-3"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Konfirmasi password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="flex absolute inset-y-0 right-0 items-center pr-3"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {data.password !== confirmPassword && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        Kata sandi tidak cocok
                                    </p>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={generatePassword}
                                className="mt-2 w-full"
                            >
                                <RefreshCw className="mr-2 w-4 h-4" /> Hasilkan Kata Sandi Otomatis
                            </Button>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role">Peran</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) =>
                                        setData("role", value)
                                    }
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Pilih Peran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            Master
                                        </SelectItem>
                                        <SelectItem value="manager">
                                            Manager
                                        </SelectItem>
                                        <SelectItem value="doctor">
                                            Dokter
                                        </SelectItem>
                                        <SelectItem value="paramedis">
                                            Paramedis
                                        </SelectItem>
                                        <SelectItem value="cashier">
                                            Kasir
                                        </SelectItem>
                                        <SelectItem value="warehouse">
                                            Warehouse
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            {/* Tanda Tangan */}
                            <div className="space-y-2">
                                <Label htmlFor="signature">Tanda Tangan</Label>
                                <SignatureInput
                                    canvasRef={canvasRef}
                                    onSignatureChange={setSignature}
                                />
                                {/* {signature && (
                                    <img
                                        src={signature}
                                        alt="Preview Tanda Tangan"
                                        className="mt-2 w-full max-w-xs h-auto"
                                    />
                                )} */}
                                {errors.signature && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.signature}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? "Menambahkan..." : "Tambah Staff"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AdminSidebar>
    );
}
