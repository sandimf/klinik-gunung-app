import React from "react";
import PropTypes from 'prop-types';
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Edit } from 'lucide-react';
import {toast} from "sonner"

export function EditAnswerDialog({ id, question, answer_text, onSave }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { data, setData, put, processing, errors } = useForm({
        answer: [answer_text], // Menyimpan jawaban sebagai array
    });

    const handleSave = (e) => {
        e.preventDefault();

        // Pastikan jawaban adalah array jika Anda mengharapkan lebih dari satu jawaban
        const answerArray = Array.isArray(data.answer) ? data.answer : [data.answer]; // Pastikan 'answer' adalah array

        put(route("quesioner.update", { id }), {
            preserveState: true,
            preserveScroll: true,
            data: { answers: answerArray }, // Mengirim jawaban sebagai array dengan key 'answers'
            onSuccess: () => {
                toast.success("Jawaban berhasil diperbarui!");
                onSave(id, answerArray);
                setIsOpen(false);
            },
            onError: (errors) => {
                if (errors.answer) {
                    toast.error('Ada Kesalahan!')
                } else {
                    console.error("Kesalahan lainnya:", errors);
                }
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSave}>
                    <DialogHeader>
                        <DialogTitle>Edit Jawaban</DialogTitle>
                        <DialogDescription>
                            Ubah jawaban untuk pertanyaan ini. Klik simpan ketika selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="question" className="text-right">
                                Pertanyaan
                            </Label>
                            <div className="col-span-3">
                                <p id="question">{question}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="answer" className="text-right">
                                Jawaban
                            </Label>
                            <Input
                                id="answer"
                                value={data.answer[0]} // Menampilkan elemen pertama dari array jawaban
                                onChange={(e) => setData('answer', [e.target.value])} // Menyimpan jawaban dalam array
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan perubahan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

EditAnswerDialog.propTypes = {
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    answer_text: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
};
