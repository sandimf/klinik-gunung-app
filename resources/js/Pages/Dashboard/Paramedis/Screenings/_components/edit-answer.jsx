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
import { toast } from "sonner"

export function EditAnswerDialog({ id, question, answer_text, onSave, physicalField, answerType }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [error, setError] = React.useState(null);

    // Initialize form dengan data yang tepat
    const { data, setData, put, processing, errors } = useForm({
        answer: !physicalField ? [answer_text] : undefined,
        tinggi_badan: physicalField === 'tinggi_badan' ? answer_text : undefined,
        berat_badan: physicalField === 'berat_badan' ? answer_text : undefined,
    });

    // Reset state saat dialog dibuka
    React.useEffect(() => {
        if (isOpen) {
            setError(null);
            if (physicalField) {
                if (physicalField === 'tinggi_badan') {
                    setData('tinggi_badan', answer_text || "");
                } else if (physicalField === 'berat_badan') {
                    setData('berat_badan', answer_text || "");
                }
            } else {
                setData('answer', [answer_text]);
            }
        }
    }, [isOpen, answer_text, physicalField]);

    const handleSave = (e) => {
        e.preventDefault();
        setError(null);

        if (physicalField) {
            // Validasi dengan current value
            const currentValue = physicalField === 'tinggi_badan' ? data.tinggi_badan : data.berat_badan;
            const trimmedValue = currentValue?.toString().trim();

            if (!trimmedValue || isNaN(Number(trimmedValue))) {
                setError("Nilai tidak boleh kosong dan harus berupa angka.");
                return;
            }

            put(route('patients.updatePhysical', { id }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    onSave(id, [trimmedValue]);
                    setIsOpen(false);
                },
                onError: (err) => {
                    if (err?.tinggi_badan) {
                        const errorMessage = Array.isArray(err.tinggi_badan)
                            ? err.tinggi_badan[0]
                            : err.tinggi_badan;
                        setError(errorMessage);
                    } else if (err?.berat_badan) {
                        const errorMessage = Array.isArray(err.berat_badan)
                            ? err.berat_badan[0]
                            : err.berat_badan;
                        setError(errorMessage);
                    } else if (err?.message) {
                        setError(err.message);
                    } else {
                        setError('Gagal update data fisik');
                    }
                },
            });
        } else {
            // Kode untuk non-physical field
            put(route("quesioner.update", { id }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    onSave(id, Array.isArray(data.answer) ? data.answer : [data.answer]);
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
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (physicalField) {
            if (value && isNaN(Number(value))) {
                setError('Harus berupa angka (boleh desimal)');
            } else {
                setError('');
            }
            if (physicalField === 'tinggi_badan') {
                setData('tinggi_badan', value);
            } else if (physicalField === 'berat_badan') {
                setData('berat_badan', value);
            }
        } else {
            setData('answer', [value]);
        }
    };

    const getCurrentValue = () => {
        if (physicalField) {
            return physicalField === 'tinggi_badan' ? data.tinggi_badan : data.berat_badan;
        }
        return data.answer?.[0] || '';
    };

    let inputType = 'text';
    if (physicalField) {
        inputType = 'number';
    } else if (answerType === 'date') {
        inputType = 'date';
    } else if (answerType === 'number') {
        inputType = 'number';
    }

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
                        <DialogTitle>Edit {question}</DialogTitle>
                        <DialogDescription>
                            Ubah jawaban untuk pertanyaan ini. Klik simpan ketika selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="answer" className="text-right">
                                Jawaban
                            </Label>
                            <Input
                                id="answer"
                                value={getCurrentValue()}
                                onChange={handleInputChange}
                                className="col-span-3"
                                min={physicalField ? 1 : undefined}
                                step={physicalField ? 'any' : undefined}
                                placeholder={physicalField === 'tinggi_badan' ? 'cm' : physicalField === 'berat_badan' ? 'kg' : ''}
                            />
                            {error && (
                                <div className="col-span-4 text-red-600 text-sm">{error}</div>
                            )}
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
    physicalField: PropTypes.oneOf(['tinggi_badan', 'berat_badan']),
    answerType: PropTypes.string,
};