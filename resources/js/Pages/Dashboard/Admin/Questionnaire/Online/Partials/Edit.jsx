import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { AlertCircle, Edit, Plus, Trash2,CircleCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/Components/ui/dialog";
import { toast, Toaster } from "sonner";


const EditQuestionModal = ({ question, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [optionInput, setOptionInput] = useState("");

  const { data, setData, put, errors, reset } = useForm({
    id: question?.id || "",
    question_text: question?.question_text || "",
    answer_type: question?.answer_type || "text",
    options: question?.options || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmEdit = () => {
    put(route("questioner-online.update", data.id), {
      onSuccess: () => {
        toast.success("Pertanyaan berhasil diperbarui", {
          icon: <CircleCheck className="w-5 h-5 text-green-500" />
        });
        setIsOpen(false);
        setShowConfirmation(false);
        reset();
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  const handleAddOption = () => {
    if (optionInput.trim() !== "") {
      setData("options", [...data.options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = data.options.filter((_, i) => i !== index);
    setData("options", updatedOptions);
  };

  return (
    <>
      <Toaster position="top-center" />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon"><Edit/></Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pertanyaan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question_text">Teks Pertanyaan</Label>
              <Input
                id="question_text"
                value={data.question_text}
                onChange={(e) => setData("question_text", e.target.value)}
                placeholder="Masukkan teks pertanyaan"
              />
              {errors.question_text && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.question_text}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer_type">Tipe Jawaban</Label>
              <Select
                value={data.answer_type}
                onValueChange={(value) => setData("answer_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe jawaban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Teks</SelectItem>
                  <SelectItem value="number">Angka</SelectItem>
                  <SelectItem value="date">Tanggal</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="checkbox_textarea">Checkbox + Textarea</SelectItem>
                </SelectContent>
              </Select>
              {errors.answer_type && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.answer_type}</AlertDescription>
                </Alert>
              )}
            </div>

            {(data.answer_type === "select" || data.answer_type === "checkbox" || data.answer_type === "checkbox_textarea") && (
              <div className="space-y-4">
                <Label>Opsi</Label>
                <div className="flex space-x-2">
                  <Input
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Tambahkan opsi"
                  />
                  <Button type="button" onClick={handleAddOption} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="space-y-2">
                  {data.options.map((option, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Checkbox disabled />
                      <span>{option}</span>
                      <Button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
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

            <Button type="submit" className="w-full">Simpan Perubahan</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Perubahan</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menyimpan perubahan?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Batal
            </Button>
            <Button onClick={confirmEdit}>
              Ya, Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditQuestionModal;
