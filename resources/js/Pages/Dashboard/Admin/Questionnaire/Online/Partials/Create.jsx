import React, { useState } from "react";
import { useForm,Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { AlertCircle, Plus, Trash2,CircleCheck,X } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";

export default function CreateQuestionnaire() {
    const { data, setData, post, errors, processing } = useForm({
        question_text: "",
        answer_type: "text",
        options: [],
    });

    const [optionInput, setOptionInput] = useState("");

    // Add option: only the label is stored
    const handleAddOption = () => {
        if (optionInput.trim() !== "") {
            setData("options", [...data.options, optionInput.trim()]); // Store only label
            setOptionInput("");
        }
    };

    // Remove option
    const handleRemoveOption = (index) => {
        const updatedOptions = data.options.filter((_, i) => i !== index);
        setData("options", updatedOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("questioner-online.store"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    question_text: "",
                    answer_type: "text",
                    options: [],
                });
            },
            onError: () => {
            },
        });
    };

    return (
        <AdminSidebar header={"Buat Kuisioner"}>
            <Head title="Buat Kuesioner Online" />
            <Card>
                <CardHeader>
                    <CardTitle>Buat Kuesioner Online</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="question_text">Question Text</Label>
                            <Input
                                id="question_text"
                                value={data.question_text}
                                onChange={(e) =>
                                    setData("question_text", e.target.value)
                                }
                                placeholder="Enter the question"
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
                            <Label htmlFor="answer_type">Answer Type</Label>
                            <Select
                                value={data.answer_type}
                                onValueChange={(value) =>
                                    setData("answer_type", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select answer type" />
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

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? "Creating..." : "Create Question"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AdminSidebar>
    );
}
