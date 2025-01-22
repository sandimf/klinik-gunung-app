import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast, Toaster } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { AlertCircle, Info, Plus, Trash2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";

export default function CreateQuestionnaire() {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
    
    const { data, setData, post, errors } = useForm({
        question_text: "",
        answer_type: "text",
        options: [],
        requires_doctor: false,
    });

    const [optionInput, setOptionInput] = useState("");

    const handleAddOption = () => {
        if (optionInput.trim() !== "") {
            setData("options", [...data.options, optionInput.trim()]);
            setOptionInput("");
        }
    };

    const [showDoctorCondition, setShowDoctorCondition] = useState(false);

    // Remove option
    const handleRemoveOption = (index) => {
        const updatedOptions = data.options.filter((_, i) => i !== index);
        setData("options", updatedOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route("questioner.store"), {
            title,
            description,
            onSuccess: () => {
                setIsLoading(false);
                toast.success("Berhasil Membuat Kuesioner",{
                    icon: <Info/>
                });
            },
            onError: (errors) => {
                setIsLoading(false);
                Object.values(errors).forEach((error) => {
                    toast.error("Gagal Membuat Kuesioner",error, {
                        icon: <X className="h-5 w-5 text-red-500" />
                    });
                });
            },
        });
    };

    return (
        <AdminSidebar header={"Buat Kuisioner"}>
            <Head title="Buat Kuesioner" />
            <Toaster position="top-center" />
            <Card>
                <CardHeader>
                    <CardTitle>Buat Kuesioner</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="question_text">
                                Pertanyaan Kuesioner
                            </Label>
                            <Input
                                id="question_text"
                                value={data.question_text}
                                onChange={(e) =>
                                    setData("question_text", e.target.value)
                                }
                                placeholder="Pertanyaan Kuesioner"
                            />
                            {errors.question_text && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {errors.question_text}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="answer_type">Jenis Jawaban</Label>
                            <Select
                                value={data.answer_type}
                                onValueChange={(value) =>
                                    setData("answer_type", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tipe Jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">
                                        Number
                                    </SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="textarea">
                                        Textarea
                                    </SelectItem>
                                    <SelectItem value="select">
                                        Select
                                    </SelectItem>
                                    <SelectItem value="checkbox">
                                        Checkbox
                                    </SelectItem>
                                    <SelectItem value="checkbox_textarea">
                                        Checkbox + Textarea
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.answer_type && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {errors.answer_type}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {(data.answer_type === "select" ||
                            data.answer_type === "checkbox" ||
                            data.answer_type === "checkbox_textarea") && (
                            <div className="space-y-4">
                                <Label>Options</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        value={optionInput}
                                        onChange={(e) =>
                                            setOptionInput(e.target.value)
                                        }
                                        placeholder="Add an option"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddOption}
                                        size="icon"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <ul className="space-y-2">
                                    {data.options.map((option, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox disabled />
                                            <span>{option}</span>{" "}
                                            {/* Display only the label */}
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveOption(index)
                                                }
                                                variant="destructive"
                                                size="icon"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="showDoctorCondition"
                                    checked={showDoctorCondition}
                                    onCheckedChange={setShowDoctorCondition}
                                />
                                <Label htmlFor="showDoctorCondition">
                                    Kondisi jika jawaban tertentu masuk ke
                                    dokter (Opsional)
                                </Label>
                            </div>
                            {showDoctorCondition && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="condition_value">
                                            Nilai Kondisi
                                        </Label>
                                        <Input
                                            id="condition_value"
                                            value={data.condition_value}
                                            onChange={(e) =>
                                                setData(
                                                    "condition_value",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="ex: ya"
                                        />
                                        {errors.condition_value && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    {errors.condition_value}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="requires_doctor"
                                            checked={data.requires_doctor}
                                            onCheckedChange={(value) =>
                                                setData(
                                                    "requires_doctor",
                                                    value
                                                )
                                            }
                                        />
                                        <Label htmlFor="requires_doctor">
                                            Screening akan dicek dokter
                                        </Label>
                                    </div>
                                </>
                            )}
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Memproses..."
                                        : "Buat Pertanyaan"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Konfirmasi Pembuatan Pertanyaan
                                    </DialogTitle>
                                    <DialogDescription>
                                        Apakah Anda yakin ingin membuat
                                        pertanyaan ini?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Ya, Buat Pertanyaan
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </form>
                </CardContent>
            </Card>
        </AdminSidebar>
    );
}
