'use client';

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Upload, FileUp } from 'lucide-react';
import Sidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { toast, Toaster } from "sonner";
import { Head } from "@inertiajs/react"

export default function ImportObat() {
  const [file, setFile] = useState(null); // Tambahkan tipe File | null untuk TypeScript

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Harap pilih file CSV sebelum mengimpor.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    router.post(route('import.combined'), formData, {
      onSuccess: () => {
        toast.success('File berhasil diimport!');
        setFile(null); // Reset file setelah berhasil diupload
      },
      onError: (errors) => {
        toast.error('Gagal mengimpor file. Silakan coba lagi.');
        console.error(errors); // Untuk debugging
      },
    });
  };

  return (
    <Sidebar>
      <div className="container mx-auto p-6 space-y-6">
        <Head title='Import Data Obat' />
        <Toaster position="top-right" /> {/* Toast notification */}
        <h1 className="text-3xl font-bold mb-6">Import Obat</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Upload File Obat
            </CardTitle>
            <CardDescription>
              Upload file CSV atau Excel berisi daftar obat untuk diimpor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="file-upload">Pilih File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!file} // Disable tombol jika file belum dipilih
            >
              <FileUp className="mr-2 h-4 w-4" />
              Import Obat
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Sidebar>
  );
}
