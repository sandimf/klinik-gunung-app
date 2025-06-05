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
import { analyzeImage } from "./_components/Ai";
import Header from "@/Components/Navbar";

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const unansweredQuestions = questions.filter(
            (question) => !answers[question.id]
        );
        if (unansweredQuestions.length > 0) {
            const newErrors = {};
            unansweredQuestions.forEach((question) => {
                newErrors[question.id] = "Pertanyaan ini wajib dijawab";
            });
            setFormErrors(newErrors);
            toast.error("Harap jawab semua pertanyaan sebelum mengirimkan.");
            return;
        }

        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            questioner_id: questionId,
            answer: answers[questionId],
        }));

        setIsLoading(true);

        setTimeout(() => {
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
                        setIsLoading(false); // Matikan loading setelah berhasil
                        reset();
                        setAgreedToPrivacy(false);
                        setEntryMethod("manual");
                        setImageFile(null);
                        setIsAnalyzing(false);
                        setAnalysisError(null);
                        setIsCameraActive(false);
                        setFormErrors({});
                        setAnswers({});
                    },
                    onError: (errors) => {
                        setIsLoading(false); // Matikan loading setelah error
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
        }, 2000); // Delay 2 detik (2000 milidetik), bisa diubah sesuai kebutuhan
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file); // Simpan file ke state untuk preview
            setData("ktp_images", file); // Simpan file ke state form untuk pengiriman
            await analyzeImageWrapper(file); // Analisis gambar menggunakan AI (opsional)
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
                date_of_birth: parsedData["Tanggal Lahir"] || "",
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

    return (
        <>
            <Header />
            <Toaster richColors position="top-center" />
            {questions.length === 0 ? (
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Ups Maaf</h1>
                    <p className="text-lg font-semibold text-gray-500">
                        Belum bisa melakukan screening. Tidak ada kuesioner yang
                        tersedia saat ini.
                    </p>
                </div>
            ) : (
                <div className="container p-4 mx-auto">
                    <Card className="mb-6">
                        <Head title="Screening" />
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                Screening Now
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                                            Click to upload
                                                        </span>{" "}
                                                        or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        SVG, PNG, JPG or GIF
                                                        (MAX. 800x400px)
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
                                                ? "Analyzing..."
                                                : "Select KTP Image"}
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
                                                ? "Stop Camera"
                                                : "Start Camera"}
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <PatientInfoForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                Kuesioner
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {questions?.map((question) => (
                                    <div
                                        key={question.id}
                                        className="rounded-lg"
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
                                                        placeholder="Enter your answer"
                                                    />
                                                    {formErrors[
                                                        question.id
                                                    ] && (
                                                        <p className="text-sm text-red-500">
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
                                                        <p className="text-sm text-red-500">
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
                                                                        checked={
                                                                            Array.isArray(
                                                                                answers[
                                                                                    question
                                                                                        .id
                                                                                ]
                                                                                    ?.options
                                                                            ) &&
                                                                            answers[
                                                                                question
                                                                                    .id
                                                                            ]?.options.includes(
                                                                                option
                                                                            )
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            const updatedAnswers =
                                                                                {
                                                                                    ...answers[
                                                                                        question
                                                                                            .id
                                                                                    ],
                                                                                };
                                                                            updatedAnswers.options =
                                                                                Array.isArray(
                                                                                    updatedAnswers.options
                                                                                )
                                                                                    ? [
                                                                                          ...updatedAnswers.options,
                                                                                      ]
                                                                                    : [];
                                                                            if (
                                                                                checked
                                                                            ) {
                                                                                updatedAnswers.options.push(
                                                                                    option
                                                                                );
                                                                            } else {
                                                                                const indexToRemove =
                                                                                    updatedAnswers.options.indexOf(
                                                                                        option
                                                                                    );
                                                                                if (
                                                                                    indexToRemove >
                                                                                    -1
                                                                                ) {
                                                                                    updatedAnswers.options.splice(
                                                                                        indexToRemove,
                                                                                        1
                                                                                    );
                                                                                }
                                                                            }
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
                                                    <Textarea
                                                        value={
                                                            answers[question.id]
                                                                ?.textarea || ""
                                                        }
                                                        onChange={(e) => {
                                                            const updatedAnswers =
                                                                {
                                                                    ...answers[
                                                                        question
                                                                            .id
                                                                    ],
                                                                    textarea:
                                                                        e.target
                                                                            .value,
                                                                };
                                                            handleAnswerChange(
                                                                question.id,
                                                                updatedAnswers
                                                            );
                                                        }}
                                                        placeholder="Jelaskan"
                                                    />
                                                    {formErrors[
                                                        question.id
                                                    ] && (
                                                        <p className="text-sm text-red-500">
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
                                                            <SelectValue placeholder="Select an option" />
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
                                                        <p className="text-sm text-red-500">
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
                                                        placeholder="Enter your answer"
                                                    />
                                                    {formErrors[
                                                        question.id
                                                    ] && (
                                                        <p className="text-sm text-red-500">
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
                                                        placeholder="Enter your answer"
                                                    />
                                                    {formErrors[
                                                        question.id
                                                    ] && (
                                                        <p className="text-sm text-red-500">
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
                                                        placeholder="Enter your answer"
                                                    />
                                                    {formErrors[
                                                        question.id
                                                    ] && (
                                                        <p className="text-sm text-red-500">
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
                                <div className="flex items-center mt-4 mb-4 space-x-2">
                                    <Checkbox
                                        id="privacyAgreement"
                                        checked={agreedToPrivacy}
                                        onCheckedChange={setAgreedToPrivacy}
                                    />
                                    <label
                                        htmlFor="privacyAgreement"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree to the privacy policy
                                    </label>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing || !agreedToPrivacy}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                            Please wait...
                                        </>
                                    ) : (
                                        <>Submit</>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
