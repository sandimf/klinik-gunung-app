import React, { useState } from 'react';
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head, Link } from '@inertiajs/react';
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
import EditQuestionModal from './Partials/Edit';
import { Plus } from 'lucide-react';

export default function Index({ questions }) {
    const [questionList, setQuestionList] = useState(questions.data || []);

    const handleEditClick = (question) => {
        setCurrentQuestion(question);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (editedQuestion) => {
        setQuestionList(prevList =>
            prevList.map(q => q.id === editedQuestion.id ? editedQuestion : q)
        );
        setIsEditModalOpen(false);
    };

    return (
        <AdminSidebar header={'Daftar Kuesioner'}>
            <Head title="Daftar Kuesioner" />
            <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
            <h2 className='text-2xl font-bold tracking-tight'>Daftar Kuesioner Online</h2>
                <div className='flex gap-2'>
                    <Link href={route("questioner-online.create")}>
                        <Button className='space-x-1' >
                            <Plus/>
                            <span>Buat Kuesioner</span>
                        </Button>
                    </Link>
                </div>
            </div>
            <Table>
                <TableCaption>Daftar Kuesioner Online</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Teks Pertanyaan</TableHead>
                        <TableHead>Tipe Jawaban</TableHead>
                        <TableHead>Opsi</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {questionList.map((question, index) => (
                        <TableRow key={question.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{question.question_text}</TableCell>
                            <TableCell>{question.answer_type}</TableCell>
                            <TableCell>{question.options ? question.options.join(', ') : '-'}</TableCell>
                            <TableCell>
                                <EditQuestionModal question={question} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </AdminSidebar>
    );
}

