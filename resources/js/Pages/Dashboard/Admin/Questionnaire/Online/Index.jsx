import React, { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import EditQuestionModal from './Partials/Edit';

export default function Index({ questions }) {
    const [questionList, setQuestionList] = useState(questions.data || []);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);

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
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Daftar Pertanyaan Kuesioner Online</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>Daftar pertanyaan kuesioner Online</TableCaption>
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
                                            <div className="flex space-x-2">
                                            <EditQuestionModal question={question}/>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebar>
    );
}

