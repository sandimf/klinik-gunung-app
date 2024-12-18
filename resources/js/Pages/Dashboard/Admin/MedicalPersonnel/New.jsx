"use client"

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
import { Toaster, toast } from "sonner";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { CheckCircle2, X, CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form"

export default function CreatePersonal({ auth }) {
  const initialData = {
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: "",
    nik: "",
    date_of_birth: "", // tanggal lahir disimpan dalam bentuk string 'YYYY-MM-DD'
  };

  // State untuk menyimpan tanggal yang dipilih
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // Mengatur tanggal ketika dipilih
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      // Simpan tanggal yang dipilih dalam format 'YYYY-MM-DD'
      setData("date_of_birth", date.toISOString().split("T")[0]); // YYYY-MM-DD
    }
  };

  // Form dari @inertiajs/react
  const { data, setData, post, processing, errors } = useForm(initialData);

  // Submit handler untuk form
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("users.store"), {
      onSuccess: () => {
        toast.success(`User ${data.name} berhasil ditambahkan!`, {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });
        setData(initialData);
      },
      onError: (errors) => {
        toast.error("Gagal menambahkan user. Silakan periksa kesalahan dan coba lagi.", {
          icon: <X className="h-5 w-5 text-red-500" />,
        });
        console.error(errors);
      },
    });
  };

  return (
    <AdminSidebar header="Tenaga Medis">
      <Head title="Tenaga Medis" />
      <Toaster position="top-center" />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tambah Tenaga Medis</CardTitle>
          <CardDescription>
            Silakan isi form di bawah ini untuk menambah tenaga medis baru.
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
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500" role="alert">
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
                  onChange={(e) => setData("nik", e.target.value)}
                  placeholder="Masukkan NIK"
                />
                {errors.nik && (
                  <p className="text-sm text-red-500" role="alert">
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
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="contoh@email.com"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="block text-sm font-medium ">
                  Tanggal Lahir
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[240px] pl-3 text-left font-normal"
                    >
                      {data.date_of_birth ? (
                        data.date_of_birth // Menampilkan tanggal yang dipilih dalam format YYYY-MM-DD
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                  onChange={(e) => setData("address", e.target.value)}
                  placeholder="Masukkan alamat"
                  required
                />
                {errors.address && (
                  <p className="text-sm text-red-500" role="alert">
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
                  onChange={(e) => setData("phone", e.target.value)}
                  placeholder="Masukkan nomor telepon"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Select
                  value={data.role}
                  onValueChange={(value) => setData("role", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih Peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="paramedis">Paramedis</SelectItem>
                    <SelectItem value="cashier">Kasir</SelectItem>
                    <SelectItem value="doctor">Dokter</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.role}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={processing}
            >
              {processing ? "Menambahkan..." : "Tambah Tenaga Medis"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminSidebar>
  );
}
