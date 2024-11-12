import React from 'react';
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

export default function Index({ questions }) {
    // Pastikan kita mengambil array pertanyaan dari `questions.data`
    const questionList = questions.data || []; // Jika `data` kosong, gunakan array kosong untuk mencegah error

    return (
        <AdminSidebar header={'Daftar Kuesioner'}>
            <Head title="Daftar Kuesioner" />
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Daftar Pertanyaan Kuesioner</h1>
                <Table>
                    <TableCaption>Daftar pertanyaan kuesioner</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Teks Pertanyaan</TableHead>
                            <TableHead>Tipe Jawaban</TableHead>
                            <TableHead>Opsi</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questionList.map((question) => (
                            <TableRow key={question.id}>
                                <TableCell>{question.id}</TableCell>
                                <TableCell>{question.question_text}</TableCell>
                                <TableCell>{question.answer_type}</TableCell>
                                <TableCell>{question.options ? question.options.join(', ') : '-'}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="icon">
                                            <PencilIcon className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminSidebar>
    );
};
