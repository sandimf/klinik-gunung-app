import React, { useState, useRef, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import {
    Upload,
    CheckCircle2,
    CircleCheck,
    InfoIcon,
    Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { toast, Toaster } from "sonner";
import { Checkbox } from "@/Components/ui/checkbox";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import WebcamComponent from "./_components/webcam";
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";

export default function PatientDataEntry({ patient, apiKey }) {
    const user = usePage().props.auth.user;

    const genAI = new GoogleGenerativeAI(apiKey || "default_api_key");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const [entryMethod, setEntryMethod] = useState("manual");
    const [imageFile, setImageFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const fileInputRef = useRef(null);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, processing, errors, error } = useForm({
        nik: patient?.nik || "",
        name: patient?.name || "",
        email: user.email,
        age: patient?.age || "",
        gender: patient?.gender || "",
        contact: patient?.contact || "",
        place_of_birth: patient?.place_of_birth || "",
        date_of_birth: patient?.date_of_birth || "",
        address: patient?.address || "",
        rt_rw: patient?.rt_rw || "",
        village: patient?.village || "",
        district: patient?.district || "",
        religion: patient?.religion || "",
        marital_status: patient?.marital_status || "",
        occupation: patient?.occupation || "",
        nationality: patient?.nationality || "",
        valid_until: patient?.valid_until || "",
        blood_type: patient?.blood_type || "",
        age: patient?.age || "",
    });

    const isReadOnly = Boolean(patient);
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!agreedToPrivacy) {
            toast.error(
                "Please agree to the privacy policy before submitting."
            );
            return;
        }

        setIsLoading(true); // Animasi loading langsung aktif

        // Tambahkan delay sebelum menjalankan `post`
        setTimeout(() => {
            post(route("information.store"), {
                onSuccess: () => {
                    setIsLoading(false); // Nonaktifkan loading setelah berhasil
                    toast.success(`Berhasil`, {
                        icon: (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ),
                    });
                },
                onError: () => {
                    setIsLoading(false);
                    toast.error("Ada kesalahan!");
                },
            });
        }, 2000); // Delay selama 2 detik
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            analyzeImage(file);
        }
    };

    const handleCameraCapture = (imageSrc) => {
        fetch(imageSrc)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], "camera_capture.jpg", {
                    type: "image/jpeg",
                });
                setImageFile(file);
                analyzeImage(file);
            });
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    const analyzeImage = async (file) => {
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const base64Image = await fileToBase64(file);

            const prompt = `
        Analyze this KTP (Indonesian ID card) image and extract the following information:
        - NIK (ID Number)
        - Nama (Name)
        - Tempat Lahir (Place of Birth)
        - Tanggal Lahir (Date of Birth in the format "DD Month YYYY")
        - Jenis Kelamin (Gender female, male, other)
        - Alamat (Address)
        - RT/RW (Neighborhood/Community Unit)
        - Kelurahan/Desa (Village)
        - Kecamatan (District)
        - Agama (Religion)
        - Status Perkawinan (Marital Status)
        - Pekerjaan (Occupation)
        - Kewarganegaraan (Nationality)
        - Berlaku Hingga (Valid Until)
        - Golongan Darah (Blood Type)

        Present the extracted information in a JSON format with these fields as keys.
      `;
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Image.split(",")[1],
                        mimeType: file.type,
                    },
                },
            ]);

            const extractedText = result.response.text();

            const jsonStart = extractedText.indexOf("{");
            const jsonEnd = extractedText.lastIndexOf("}") + 1;
            const jsonString = extractedText.slice(jsonStart, jsonEnd);

            const parsedData = JSON.parse(jsonString);

            const capitalizeWords = (str) => {
                if (!str) return "";
                return str
                    .toLowerCase()
                    .replace(/\b\w/g, (match) => match.toUpperCase());
            };
            setData({
                ...data,
                nik: parsedData.NIK || "",
                name: capitalizeWords(parsedData.Nama || ""),
                place_of_birth: capitalizeWords(
                    parsedData["Tempat Lahir"] || ""
                ),
                date_of_birth: capitalizeWords(
                    parsedData["Tanggal Lahir"] || ""
                ),
                gender: capitalizeWords(parsedData["Jenis Kelamin"] || ""),
                address: capitalizeWords(parsedData.Alamat || ""),
                rt_rw: capitalizeWords(parsedData["RT/RW"] || ""),
                village: capitalizeWords(parsedData["Kelurahan/Desa"] || ""),
                district: capitalizeWords(parsedData.Kecamatan || ""),
                religion: capitalizeWords(parsedData.Agama || ""),
                marital_status: capitalizeWords(
                    parsedData["Status Perkawinan"] || ""
                ),
                occupation: capitalizeWords(parsedData.Pekerjaan || ""),
                nationality: capitalizeWords(parsedData.Kewarganegaraan || ""),
                valid_until: capitalizeWords(
                    parsedData["Berlaku Hingga"] || ""
                ),
                blood_type: capitalizeWords(parsedData["Golongan Darah"] || ""),
            });
        } catch (err) {
            setAnalysisError("Error during image analysis. Please try again.");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            toast(flash.message, {
                icon: <CircleCheck className="w-5 h-5 text-green-500" />,
            });
        }
    }, [flash.message]);

    return (
        <Sidebar header={"Patient Information"}>
            <Toaster richColors position="top-center" />
            <Card>
                <Head title="Patient Information" />
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Formulir Data Pribadi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-4">
                        <InfoIcon className="w-4 h-4" />
                        <AlertTitle>Informasi</AlertTitle>
                        <AlertDescription>
                            Kamu hanya bisa mengakses fitur hanya jika sudah
                            mengisi formulir ini.
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
                            <TabsTrigger value="upload">Upload KTP</TabsTrigger>
                            <TabsTrigger value="camera">Scan KTP</TabsTrigger>
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
                                            Selected file: {imageFile.name}
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
                                        ? "Ai Menganalisa..."
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
                                        setIsCameraActive(!isCameraActive)
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    value={data.nik}
                                    placeholder="Nik"
                                    onChange={(e) =>
                                        setData("nik", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.nik && (
                                    <p className="text-sm text-red-600">
                                        {errors.nik}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    placeholder="Nama Lengkap"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="place_of_birth">
                                    Tempat Lahir
                                </Label>
                                <Input
                                    id="place_of_birth"
                                    placeholder="Tempat Lahir"
                                    value={data.place_of_birth}
                                    onChange={(e) =>
                                        setData(
                                            "place_of_birth",
                                            e.target.value
                                        )
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.place_of_birth && (
                                    <p className="text-sm text-red-600">
                                        {errors.place_of_birth}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="date_of_birth">
                                    Tanggal Lahir
                                </Label>
                                <Input
                                    id="date_of_birth"
                                    placeholder="23 maret 2000"
                                    value={data.date_of_birth}
                                    onChange={(e) =>
                                        setData("date_of_birth", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />{" "}
                                {errors.date_of_birth && (
                                    <p className="text-sm text-red-600">
                                        {errors.date_of_birth}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="gender">Jenis Kelamin</Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) =>
                                        setData("gender", value)
                                    }
                                >
                                    <SelectTrigger className="p-2 w-full rounded border">
                                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Jenis Kelamin
                                            </SelectLabel>
                                            <SelectItem value="male">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="female">
                                                Female
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <p className="text-sm text-red-600">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="address">Alamat</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    placeholder="Alamat"
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-600">
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="rt_rw">RT/RW</Label>
                                <Input
                                    id="rt_rw"
                                    value={data.rt_rw}
                                    placeholder="002/014"
                                    onChange={(e) =>
                                        setData("rt_rw", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.rt_rw && (
                                    <p className="text-sm text-red-600">
                                        {errors.rt_rw}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="village">Desa</Label>
                                <Input
                                    id="village"
                                    value={data.village}
                                    placeholder="Desa"
                                    onChange={(e) =>
                                        setData("village", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.village && (
                                    <p className="text-sm text-red-600">
                                        {errors.village}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="district">Kecamatan</Label>
                                <Input
                                    id="district"
                                    value={data.district}
                                    placeholder="Kecamatan"
                                    onChange={(e) =>
                                        setData("district", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.district && (
                                    <p className="text-sm text-red-600">
                                        {errors.district}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="religion">Agama</Label>
                                <Input
                                    id="religion"
                                    value={data.religion}
                                    placeholder="Agama"
                                    onChange={(e) =>
                                        setData("religion", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.religion && (
                                    <p className="text-sm text-red-600">
                                        {errors.religion}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="marital_status">
                                    Status Perkawinan
                                </Label>
                                <Select
                                    value={data.marital_status}
                                    onValueChange={(value) =>
                                        setData("marital_status", value)
                                    }
                                >
                                    <SelectTrigger className="p-2 w-full rounded border">
                                        <SelectValue placeholder="Status Perkawinan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="Belum Kawin">
                                                Belum Kawin
                                            </SelectItem>
                                            <SelectItem value="Kawin">
                                                Kawin
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.marital_status && (
                                    <p className="text-sm text-red-600">
                                        {errors.marital_status}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="occupation">Pekerjaan</Label>
                                <Input
                                    id="occupation"
                                    value={data.occupation}
                                    placeholder="pekerjaan"
                                    onChange={(e) =>
                                        setData("occupation", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.occupation && (
                                    <p className="text-sm text-red-600">
                                        {errors.occupation}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="nationality">
                                    Kewarganegaraan
                                </Label>
                                <Input
                                    id="nationality"
                                    value={data.nationality}
                                    placeholder="Kewarganegaraan"
                                    onChange={(e) =>
                                        setData("nationality", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.nationality && (
                                    <p className="text-sm text-red-600">
                                        {errors.nationality}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="valid_until">
                                    Berlaku Hingga
                                </Label>
                                <Input
                                    id="valid_until"
                                    value={data.valid_until}
                                    placeholder="Berlaku Hingga"
                                    onChange={(e) =>
                                        setData("valid_until", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.valid_until && (
                                    <p className="text-sm text-red-600">
                                        {errors.valid_until}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="blood_type">
                                    Golongan Dara
                                </Label>
                                <Input
                                    id="blood_type"
                                    value={data.blood_type}
                                    placeholder="Golonga darah, - jika tidak ada"
                                    onChange={(e) =>
                                        setData("blood_type", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.blood_type && (
                                    <p className="text-sm text-red-600">
                                        {errors.blood_type}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="age">Umur</Label>
                                <Input
                                    id="age"
                                    value={data.age}
                                    placeholder="Umur"
                                    onChange={(e) =>
                                        setData("age", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.age && (
                                    <p className="text-sm text-red-600">
                                        {errors.age}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    placeholder="johndoe@example.com"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    readOnly
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="contact">Nomor Telepon</Label>
                                <Input
                                    id="contact"
                                    value={data.contact}
                                    placeholder="Nomor Telepon"
                                    onChange={(e) =>
                                        setData("contact", e.target.value)
                                    }
                                    readOnly={isReadOnly}
                                />
                                {errors.contact && (
                                    <p className="text-sm text-red-600">
                                        {errors.contact}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center mt-4 space-x-2">
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
                        </div>
                        {!isReadOnly && (
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
                        )}
                        {isReadOnly && (
                            <p className="text-gray-600">
                                Your profile data cannot be edited.
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </Sidebar>
    );
}
