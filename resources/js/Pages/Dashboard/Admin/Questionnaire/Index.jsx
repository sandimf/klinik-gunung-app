import React, { useState, useEffect } from "react";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head, Link, usePage } from "@inertiajs/react";
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
import EditQuestionModal from "./Partials/Edit";
import { Plus,CircleCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";


export default function Index({ questions }) {
    const [questionList, setQuestionList] = useState(questions.data || []);

    const handleEditClick = (question) => {
        setCurrentQuestion(question);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (editedQuestion) => {
        setQuestionList((prevList) =>
            prevList.map((q) =>
                q.id === editedQuestion.id ? editedQuestion : q
            )
        );
        setIsEditModalOpen(false);
    };

    return (
        <AdminSidebar header={"Daftar Kuesioner"}>
            <Head title="Daftar Kuesioner" />
            <Card>
                <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Daftar Kuesioner
                    </CardTitle>
                    <Link href={route("questioner.create")}>
                        <Button className="space-x-1">
                            <Plus />
                            <span>Buat Pertanyaan Baru</span>
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>
                            Kelola daftar pertanyaan yang akan digunakan dalam
                            screening.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Pertanyaan</TableHead>
                                <TableHead>Tipe Jawaban</TableHead>
                                <TableHead>Opsi</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questionList.map((question, index) => (
                                <TableRow key={question.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {question.question_text}
                                    </TableCell>
                                    <TableCell>
                                        {question.answer_type}
                                    </TableCell>
                                    <TableCell>
                                        {question.options
                                            ? question.options.join(", ")
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <EditQuestionModal
                                            question={question}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminSidebar>
    );
}
