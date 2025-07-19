import React, { useState, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";
import { Upload, Loader2, X, CircleCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { toast, Toaster } from "sonner";
import WebcamComponent from "./_components/Webcam";
import { PatientInfoForm } from "./_components/PatientInfoForm";
import { analyzeImage, parseTanggalLahir } from "./_components/Ai";
import { Navbar } from "@/Components/ui/navbar";
import { Dialog,  DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { usePage } from "@inertiajs/react";

export default function PatientDataEntry({ questions, apiKey }) {
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [entryMethod, setEntryMethod] = useState("manual");
    const [imageFile, setImageFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const fileInputRef = useRef(null);
    const [formErrors, setFormErrors] = useState({});
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const { auth } = usePage().props;
    const user = auth?.user;
    const { data, setData, post, processing, errors, reset } = useForm({
        nik: "",
        name: "",
        email: "",
        age: "",
        gender: "",
        contact: "",
        place_of_birth: "",
        date_of_birth: "",
        address: "",
        rt_rw: "",
        village: "",
        district: "",
        religion: "",
        marital_status: "",
        occupation: "",
        nationality: "",
        valid_until: "",
        blood_type: "",
        ktp_images: null,
        tinggi_badan: "",
        berat_badan: "",
    });

    const handleAnswerChange = (questionId, answer) => {
        const newErrors = { ...formErrors };
        if (!answer) {
            newErrors[questionId] = "Pertanyaan ini diperlukan";
        } else {
            delete newErrors[questionId];
        }
        setFormErrors(newErrors);

        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const resetAllStates = () => {
        reset();
        setAgreedToPrivacy(false);
        setEntryMethod("manual");
        setImageFile(null);
        setIsAnalyzing(false);
        setAnalysisError(null);
        setIsCameraActive(false);
        setFormErrors({});
        setAnswers({});
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const unansweredQuestions = questions.filter((question) => {
            if (question.answer_type === 'checkbox_textarea') {
                const ans = answers[question.id];
                if (ans?.options?.includes('Ya')) {
                    return !ans.textarea || ans.textarea.trim() === '';
                }
                return !ans || !Array.isArray(ans.options) || ans.options.length === 0;
            }
            return !answers[question.id];
        });
        if (unansweredQuestions.length > 0) {
            const newErrors = {};
            unansweredQuestions.forEach((question) => {
                newErrors[question.id] = "Mohon lengkapi jawaban untuk pertanyaan ini.";
            });
            setFormErrors(newErrors);
            toast.error("Silakan lengkapi seluruh pertanyaan sebelum mengirimkan.");
            return;
        }

        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            questioner_id: questionId,
            answer: answers[questionId],
        }));

        setIsLoading(true);

        router.post(
            route("screening-now.store"),
            {
                ...data,
                answers: formattedAnswers,
            },
            {
                onSuccess: () => {
                    toast.success("Screening berhasil disimpan!", {
                        icon: (
                            <CircleCheck className="w-5 h-5 text-green-500" />
                        ),
                    });
                    resetAllStates();
                    setStep(1);
                },
                onError: (errors) => {
                    setIsLoading(false);
                    if (typeof errors === "string") {
                        toast.error(errors, {
                            icon: <X className="w-5 h-5 text-red-500" />,
                        });
                    } else if (typeof errors === "object") {
                        const errorMessages = Object.values(errors).flat();
                        errorMessages.forEach((error) =>
                            toast.error(error, {
                                icon: (
                                    <X className="w-5 h-5 text-red-500" />
                                ),
                            })
                        );
                    } else {
                        toast.error("Sepertinya Ada Kesalahan!", {
                            icon: <X className="w-5 h-5 text-red-500" />,
                        });
                    }
                },
            }
        );
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setData("ktp_images", file);
            await analyzeImageWrapper(file);
        }
    };

    const handleCameraCapture = async (imageSrc) => {
        fetch(imageSrc)
            .then((res) => res.blob())
            .then(async (blob) => {
                const file = new File([blob], "camera_capture.jpg", {
                    type: "image/jpeg",
                });
                setImageFile(file);
                await analyzeImageWrapper(file);
            });
    };

    const analyzeImageWrapper = async (file) => {
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const parsedData = await analyzeImage(file, apiKey);
            setData({
                ...data,
                nik: parsedData.NIK || "",
                name: parsedData.Nama || "",
                place_of_birth: parsedData["Tempat Lahir"] || "",
                date_of_birth: parseTanggalLahir(parsedData["Tanggal Lahir"] || ""),
                gender: parsedData["Jenis Kelamin"]?.toLowerCase() || "",
                address: parsedData.Alamat || "",
                rt_rw: parsedData["RT/RW"] || "",
                village: parsedData["Kelurahan/Desa"] || "",
                district: parsedData.Kecamatan || "",
                religion: parsedData.Agama || "",
                marital_status: parsedData["Status Perkawinan"] || "",
                occupation: parsedData.Pekerjaan || "",
                nationality: parsedData.Kewarganegaraan || "",
                valid_until: parsedData["Berlaku Hingga"] || "",
                blood_type: parsedData["Golongan Darah"] || "",
            });
        } catch (err) {
            setAnalysisError(err.message);
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Stepper data
    const steps = [
        {
            label: "Data Pendaki",
            description: step > 1 ? "Selesai" : step === 1 ? "Sedang Diisi" : "Menunggu",
            status: step > 1 ? "completed" : step === 1 ? "current" : "pending",
        },
        {
            label: "Screening",
            description: step === 2 ? "Sedang Diisi" : "Menunggu",
            status: step === 2 ? "current" : "pending",
        },
    ];

    return (
        <>
            <Toaster position="top-center" />
            <Navbar user={user} />
            {questions.length === 0 ? (
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Ups Maaf 😔</h1>
                    <p className="text-lg font-semibold text-gray-500">
                        Belum bisa melakukan Screening. Tidak ada kuesioner yang
                        tersedia saat ini.
                    </p>
                </div>
            ) : (
                <div className="container p-4 mx-auto">
                    <div className="mb-8">
                        <div className="w-full max-w-2xl mx-auto flex items-center px-8 py-6 rounded-xl">
                            {steps.map((s, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex flex-col items-center flex-1 min-w-0">
                                        <div
                                            className={`flex items-center justify-center w-7 h-7 rounded-full border-2
                                                ${s.status === "completed"
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : s.status === "current"
                                                        ? "border-blue-500 text-blue-500 dark:bg-background bg-white"
                                                        : "border-muted-foreground text-muted-foreground bg-muted"}
                                                transition-colors`}
                                        >
                                            {s.status === "completed" ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="font-bold text-sm">{i + 1}</span>
                                            )}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div
                                                className={`h-1 w-full mt-1 mb-1
                                                    ${steps[i + 1].status === "completed" || s.status === "completed"
                                                        ? "bg-green-500"
                                                        : s.status === "current"
                                                            ? "bg-blue-500"
                                                            : "bg-muted-foreground/30"}
                                                    transition-colors`}
                                            />
                                        )}
                                        <div className="mt-1 text-xs font-semibold text-center"
                                            style={{ color: s.status === "current" ? "#2563eb" : undefined }}>
                                            {s.label}
                                        </div>
                                        <div className={`text-xs ${s.status === "completed" ? "text-green-600" : s.status === "current" ? "text-blue-500" : "text-muted-foreground"}`}>
                                            {s.description}
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <Card className="mb-6">
                        <Head title="Screening" />
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                {step === 1 ? "Informasi Pendaki" : "Screening"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {step === 1 && (
                                <>
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            const requiredFields = [
                                                { key: 'nik', label: 'NIK' },
                                                { key: 'name', label: 'Nama' },
                                                { key: 'gender', label: 'Jenis Kelamin' },
                                                { key: 'date_of_birth', label: 'Tanggal Lahir' },
                                            ];
                                            const missing = requiredFields.filter(f => !data[f.key]);
                                            if (missing.length > 0) {
                                                toast.error(`Silakan lengkapi data pasien terlebih dahulu.`);
                                                return;
                                            }
                                            setShowConfirmDialog(true);
                                        }}
                                        className="space-y-4"
                                    >
                                        <Alert variant="warning">
                                            <AlertDescription>
                                                <b>Perhatian:</b> Jika menggunakan AI (scan/upload KTP), mohon cek ulang data yang terisi otomatis. Data hasil AI kadang tidak sesuai, pastikan semua data sudah benar sebelum lanjut.
                                            </AlertDescription>
                                        </Alert>
                                        <Tabs
                                            value={entryMethod}
                                            onValueChange={setEntryMethod}
                                            className="mb-4"
                                        >
                                            <TabsList className="grid grid-cols-3 w-full">
                                                <TabsTrigger value="manual">
                                                    Input Manual
                                                </TabsTrigger>
                                                <TabsTrigger value="upload">
                                                    Upload KTP
                                                </TabsTrigger>
                                                <TabsTrigger value="camera">
                                                    Scan KTP
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="upload">
                                                <div className="space-y-4">
                                                    <div className="flex justify-center items-center w-full">
                                                        <Label
                                                            htmlFor="dropzone-file"
                                                            className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                                        >
                                                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                                <Upload className="mb-4 w-8 h-8 text-gray-500 dark:text-gray-400" />
                                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                    <span className="font-semibold">
                                                                        Klik untuk Unggah
                                                                    </span>{" "}
                                                                    atau seret dan lepas
                                                                    gambar di sini.
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Format: PNG atau JPG (Maks. 800x400px)
                                                                </p>

                                                            </div>
                                                            <Input
                                                                id="dropzone-file"
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                ref={fileInputRef}
                                                            />
                                                        </Label>
                                                    </div>
                                                    {imageFile && (
                                                        <div className="mt-4">
                                                            <p className="text-sm text-gray-500">
                                                                Selected file:{" "}
                                                                {imageFile.name}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <Button
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                        disabled={isAnalyzing}
                                                        className="w-full"
                                                    >
                                                        {isAnalyzing
                                                            ? "Mengupload..."
                                                            : "Pilih Foto KTP"}
                                                    </Button>
                                                    {analysisError && (
                                                        <Alert variant="destructive">
                                                            <AlertDescription>
                                                                {analysisError}
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="camera">
                                                <div className="space-y-4">
                                                    <WebcamComponent
                                                        onCapture={handleCameraCapture}
                                                        isActive={isCameraActive}
                                                        setIsActive={setIsCameraActive}
                                                    />
                                                    <Button
                                                        onClick={() =>
                                                            setIsCameraActive(
                                                                !isCameraActive
                                                            )
                                                        }
                                                        className="w-full"
                                                    >
                                                        {isCameraActive
                                                            ? "Hentikan Kamera"
                                                            : "Mulai Kamera"}
                                                    </Button>
                                                    {analysisError && (
                                                        <Alert variant="destructive">
                                                            <AlertDescription>
                                                                {analysisError}
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                        <PatientInfoForm
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                        <Button type="submit" className="w-full">
                                            Lanjut ke Screening
                                        </Button>
                                    </form>
                                    {/* Dialog konfirmasi shadcn/ui */}
                                    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Konfirmasi Data Pendaki</DialogTitle>
                                                <DialogDescription>
                                                    Apakah Anda sudah yakin data pendaki sudah benar? Pastikan data sudah dicek sebelum melanjutkan ke screening.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                                                    Batal
                                                </Button>
                                                <Button onClick={() => { setShowConfirmDialog(false); setStep(2); }}>
                                                    Yakin &amp; Lanjut
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                            {step === 2 && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Button
                                        type="button"
                                        className="w-full mb-2"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                    >
                                        Kembali ke Data Pendaki
                                    </Button>
                                    {questions?.map((question) => (
                                        <div
                                            key={question.id}
                                            className="rounded-lg mb-6"
                                        >
                                            <h3 className="mb-3 text-lg font-semibold">
                                                {question.question_text}
                                            </h3>
                                            <div className="space-y-1">
                                                {question.answer_type ===
                                                    "text" && (
                                                        <div>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    answers[
                                                                    question.id
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleAnswerChange(
                                                                        question.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Masukkan jawaban Anda"
                                                            />
                                                            {formErrors[
                                                                question.id
                                                            ] && (
                                                                    <p className="mt-2 text-sm text-red-500">
                                                                        {
                                                                            formErrors[
                                                                            question.id
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}
                                                {question.answer_type ===
                                                    "checkbox" && (
                                                        <div className="space-y-1">
                                                            {Array.isArray(
                                                                question.options
                                                            ) &&
                                                                question.options.map(
                                                                    (option, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="flex items-center space-x-2"
                                                                        >
                                                                            <Checkbox
                                                                                checked={answers[
                                                                                    question
                                                                                        .id
                                                                                ]?.includes(
                                                                                    option
                                                                                )}
                                                                                onCheckedChange={(
                                                                                    checked
                                                                                ) => {
                                                                                    const updatedAnswers =
                                                                                        checked
                                                                                            ? [
                                                                                                ...(answers[
                                                                                                    question
                                                                                                        .id
                                                                                                ] ||
                                                                                                    []),
                                                                                                option,
                                                                                            ]
                                                                                            : (
                                                                                                answers[
                                                                                                question
                                                                                                    .id
                                                                                                ] ||
                                                                                                []
                                                                                            ).filter(
                                                                                                (
                                                                                                    answer
                                                                                                ) =>
                                                                                                    answer !==
                                                                                                    option
                                                                                            );
                                                                                    handleAnswerChange(
                                                                                        question.id,
                                                                                        updatedAnswers
                                                                                    );
                                                                                }}
                                                                            />
                                                                            <span>
                                                                                {option}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )}
                                                            {formErrors[
                                                                question.id
                                                            ] && (
                                                                    <p className="mt-2 text-sm text-red-500">
                                                                        {
                                                                            formErrors[
                                                                            question.id
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}
                                                {question.answer_type ===
                                                    "checkbox_textarea" && (
                                                        <div className="space-y-1">
                                                            {Array.isArray(question.options) &&
                                                                question.options.map((option, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="flex items-center space-x-2"
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                Array.isArray(answers[question.id]?.options) &&
                                                                                answers[question.id]?.options.includes(option)
                                                                            }
                                                                            onCheckedChange={(checked) => {
                                                                                let updatedAnswers = {
                                                                                    ...answers[question.id],
                                                                                };
                                                                                if (checked) {
                                                                                    updatedAnswers.options = [option];
                                                                                    if (option === 'Tidak') {
                                                                                        updatedAnswers.textarea = '';
                                                                                    }
                                                                                } else {
                                                                                    updatedAnswers.options = [];
                                                                                    if (option === 'Tidak') {
                                                                                        updatedAnswers.textarea = '';
                                                                                    }
                                                                                }
                                                                                handleAnswerChange(question.id, updatedAnswers);
                                                                            }}
                                                                        />
                                                                        <span>{option}</span>
                                                                    </div>
                                                                ))}
                                                            {answers[question.id]?.options?.includes('Ya') && (
                                                                <Textarea
                                                                    value={answers[question.id]?.textarea || ""}
                                                                    onChange={(e) => {
                                                                        const updatedAnswers = {
                                                                            ...answers[question.id],
                                                                            textarea: e.target.value,
                                                                        };
                                                                        handleAnswerChange(question.id, updatedAnswers);
                                                                    }}
                                                                    placeholder="Jelaskan"
                                                                />
                                                            )}
                                                            {formErrors[question.id] && (
                                                                <p className="mt-2 text-sm text-red-500">
                                                                    {formErrors[question.id]}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                {question.answer_type ===
                                                    "select" && (
                                                        <div>
                                                            <Select
                                                                value={
                                                                    answers[
                                                                    question.id
                                                                    ] || ""
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    handleAnswerChange(
                                                                        question.id,
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Jawaban Anda" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.isArray(
                                                                        question.options
                                                                    ) &&
                                                                        question.options.map(
                                                                            (
                                                                                option,
                                                                                index
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    value={
                                                                                        option
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        option
                                                                                    }
                                                                                </SelectItem>
                                                                            )
                                                                        )}
                                                                </SelectContent>
                                                            </Select>
                                                            {formErrors[
                                                                question.id
                                                            ] && (
                                                                    <p className="mt-2 text-sm text-red-500">
                                                                        {
                                                                            formErrors[
                                                                            question.id
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}
                                                {question.answer_type ===
                                                    "textarea" && (
                                                        <div>
                                                            <Textarea
                                                                value={
                                                                    answers[
                                                                    question.id
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleAnswerChange(
                                                                        question.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Masukkan jawaban Anda"
                                                            />
                                                            {formErrors[
                                                                question.id
                                                            ] && (
                                                                    <p className="mt-2 text-sm text-red-500">
                                                                        {
                                                                            formErrors[
                                                                            question.id
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}
                                                {question.answer_type ===
                                                    "number" && (
                                                        <div>
                                                            <Input
                                                                type="number"
                                                                value={
                                                                    answers[
                                                                    question.id
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleAnswerChange(
                                                                        question.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Masukkan jawaban Anda"
                                                            />
                                                            {formErrors[
                                                                question.id
                                                            ] && (
                                                                    <p className="mt-2 text-sm text-red-500">
                                                                        {
                                                                            formErrors[
                                                                            question.id
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}
                                                {question.answer_type ===
                                                    "date" && (
                                                        <div>
                                                            <Input
                                                                type="date"
                                                                value={
                                                                    answers[
                                                                    question.id
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleAnswerChange(
                                                                        question.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Masukkan jawaban Anda"
                                                            />
                                                            {formErrors[
                                                                question.id
                                                            ] && (
                                                                    <p className="mt-2 text-sm text-red-500">
                                                                        {
                                                                            formErrors[
                                                                            question.id
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex items-start gap-3 mt-8 mb-4">
                                        <Checkbox id="privacyAgreement" checked={agreedToPrivacy} onCheckedChange={setAgreedToPrivacy} />
                                        <div className="grid gap-2">
                                            <Label htmlFor="privacyAgreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Saya menyetujui Kebijakan Privasi.
                                            </Label>
                                            <p className="text-muted-foreground text-sm">
                                                Saya setuju data ini digunakan oleh Klinik Gunung Semeru untuk keperluan medis dan keselamatan pendakian, sesuai kebijakan privasi.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing || !agreedToPrivacy}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                Tunggu Sebentar
                                            </>
                                        ) : (
                                            <>Kirim</>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
