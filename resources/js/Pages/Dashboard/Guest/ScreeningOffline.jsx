import React, { useState, useRef, useEffect } from "react";
import { Head, useForm, usePage,router } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";
import {  Upload, Info, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { toast, Toaster } from "sonner";
import WebcamComponent from "./_components/Webcam";
import { PatientInfoForm } from "./_components/PatientInfoForm";
import { analyzeImage } from './_components/Ai'; // Import the analyzeImage function
import Header from "@/Components/Navbar";

export default function PatientDataEntry({questions, apiKey}) {
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
    

    const { data, setData, post, processing, errors } = useForm({
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
            newErrors[questionId] = 'This question is required';
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
        
        // Validasi: pastikan semua pertanyaan sudah dijawab
        const unansweredQuestions = questions.filter(question => !answers[question.id]);
        if (unansweredQuestions.length > 0) {
            const newErrors = {};
            unansweredQuestions.forEach(question => {
                newErrors[question.id] = 'This question is required';
            });
            setFormErrors(newErrors);
            toast.error('Please answer all questions before submitting.');
            return;
        }
    
        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            questioner_id: questionId,
            answer: answers[questionId],
        }));
    
        // Menambahkan delay sebelum mengirim data
        setIsLoading(true);  // Atur loading state jika perlu
        
        setTimeout(() => {
            router.post(
                route('screening-now.store'),
                {
                    ...data,
                    answers: formattedAnswers,
                },
                {
                    onSuccess: () => {
                        toast.success('Screening berhasil disimpan!');
                        setIsLoading(false); // Matikan loading setelah berhasil
                    },
                    onError: (errors) => {
                        setIsLoading(false); // Matikan loading setelah error
                        if (typeof errors === 'string') {
                            toast.error(errors);
                        } else if (typeof errors === 'object') {
                            const errorMessages = Object.values(errors).flat();
                            errorMessages.forEach(error => toast.error(error));
                        } else {
                            toast.error('An error occurred during submission.');
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
            .then(res => res.blob())
            .then(async blob => {
                const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                setImageFile(file);
                await analyzeImageWrapper(file);
            });
    };

    const analyzeImageWrapper = async (file) => {
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const parsedData = await analyzeImage(file,apiKey);
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

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            toast(flash.message, {
                icon: <Info className="h-5 w-5 text-green-500" />
            });
        }
    }, [flash.message]);

    return (
        <>
        <Header/>
            <Toaster position="top-center" />
            <Card>
                <Head title="Patient Information" />
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Screening Now</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={entryMethod} onValueChange={setEntryMethod} className="mb-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="manual">Input Manual</TabsTrigger>
                            <TabsTrigger value="upload">Upload KTP</TabsTrigger>
                            <TabsTrigger value="camera">Scan KTP</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload">
                            <div className="space-y-4">
                                <div className="flex items-center justify-center w-full">
                                    <Label
                                        htmlFor="dropzone-file"
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
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
                                        <p className="text-sm text-gray-500">Selected file: {imageFile.name}</p>
                                    </div>
                                )}
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isAnalyzing}
                                    className="w-full"
                                >
                                    {isAnalyzing ? "Analyzing..." : "Select KTP Image"}
                                </Button>
                                {analysisError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{analysisError}</AlertDescription>
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
                                    onClick={() => setIsCameraActive(!isCameraActive)}
                                    className="w-full"
                                >
                                    {isCameraActive ? "Stop Camera" : "Start Camera"}
                                </Button>
                                {analysisError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{analysisError}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <PatientInfoForm data={data} setData={setData} errors={errors} />
                        <div className="flex items-center space-x-2 mt-4">
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
                        {questions?.map((question) => (
                        <Card key={question.id} className="mb-4">
                            <CardHeader>
                                <CardTitle>{question.question_text}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Render input berdasarkan tipe pertanyaan */}
                                {question.answer_type === 'text' && (
                                    <div>
                                        <Input
                                            type="text"
                                            value={answers[question.id] || ''}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            placeholder="Enter your answer"
                                        />
                                        {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                    </div>
                                )}
                                {/* Checkbox Input */}
                            {question.answer_type === 'checkbox' && (
                                <div>
                                    
                                    {Array.isArray(question.options) && question.options.map((option, index) => (
                                        <div key={index}>
                                            <Checkbox
                                                checked={answers[question.id]?.includes(option)}
                                                onCheckedChange={(checked) => {
                                                    const updatedAnswers = checked
                                                        ? [...(answers[question.id] || []), option]
                                                        : (answers[question.id] || []).filter((answer) => answer !== option);
                                                    handleAnswerChange(question.id, updatedAnswers);
                                                     // Debugging

                                                }}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}

                            {/* Checkbox with Textarea Input */}
                            {question.answer_type === 'checkbox_textarea' && (
                                <div>
                                    <Label>Options</Label>
                                    {Array.isArray(question.options) && question.options.map((option, index) => (
                                        <div key={index}>
                                            <Checkbox
                                                checked={Array.isArray(answers[question.id]?.options) && answers[question.id]?.options.includes(option)}
                                                onCheckedChange={(checked) => {
                                                    const updatedAnswers = { ...answers[question.id] };
                                                    updatedAnswers.options = Array.isArray(updatedAnswers.options) ? [...updatedAnswers.options] : [];
                                                    if (checked) {
                                                        updatedAnswers.options.push(option);
                                                    } else {
                                                        const indexToRemove = updatedAnswers.options.indexOf(option);
                                                        if (indexToRemove > -1) {
                                                            updatedAnswers.options.splice(indexToRemove, 1);
                                                        }
                                                    }
                                                    handleAnswerChange(question.id, updatedAnswers);
                                                }}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                    <Textarea
                                        value={answers[question.id]?.textarea || ''}
                                        onChange={(e) => {
                                            const updatedAnswers = { ...answers[question.id], textarea: e.target.value };
                                            handleAnswerChange(question.id, updatedAnswers);
                                        }}
                                        placeholder="Jelaskan"
                                    />
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}

                            {/* Select Input */}
                            {question.answer_type === 'select' && (
                                <div>
                                    <Label>Options</Label>
                                    <Select
                                        value={answers[question.id] || ''}
                                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(question.options) && question.options.map((option, index) => (
                                                <SelectItem key={index} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}

                            {/* Textarea Input */}
                            {question.answer_type === 'textarea' && (
                                <div>
                                    <Label>Answer</Label>
                                    <Textarea
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}
                            {question.answer_type === 'number' && (
                                <div>
                                    <Label>Answer</Label>
                                    <Input
                                        type="number"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}
                            {question.answer_type === 'date' && (
                                <div>
                                    <Label>Answer</Label>
                                    <Input
                                        type="date"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}

                                {/* Tambahkan jenis input lainnya seperti yang sebelumnya */}
                            </CardContent>
                        </Card>
                    ))}
                        <Button
                                type="submit"
                                className="w-full"
                                disabled={processing || !agreedToPrivacy}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait...
                                    </>
                                ) : (
                                    <>Submit</>
                                )}
                            </Button>
                    </form>
                    
                </CardContent>
            </Card>
        </>
    );
}