import React, { useState, useRef } from "react"
import { Head, useForm,usePage } from "@inertiajs/react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
import { Terminal, Upload } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import WebcamComponent from "./_components/webcam"
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";

const genAI = new GoogleGenerativeAI("API_KEY")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export default function PatientDataEntry({ patient }) {
    const [entryMethod, setEntryMethod] = useState("manual")
    const [imageFile, setImageFile] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisError, setAnalysisError] = useState(null)
    const [isCameraActive, setIsCameraActive] = useState(false)
    const fileInputRef = useRef(null)

    const { data, setData, post, processing, errors } = useForm({
        nik: patient?.nik || "",
        name: patient?.name || "",
        email: patient?.email || "",
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
    })

    const isReadOnly = Boolean(patient)

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route("information.store"))
    }

    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            setImageFile(file)
            analyzeImage(file)
        }
    }

    const handleCameraCapture = (imageSrc) => {
        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" })
                setImageFile(file)
                analyzeImage(file)
            })
    }

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }


    const analyzeImage = async (file) => {
        setIsAnalyzing(true)
        setAnalysisError(null)

        try {
            const base64Image = await fileToBase64(file)

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
      `
            const result = await model.generateContent([
                prompt,
                { inlineData: { data: base64Image.split(",")[1], mimeType: file.type } }
            ])

            const extractedText = result.response.text()

            const jsonStart = extractedText.indexOf("{")
            const jsonEnd = extractedText.lastIndexOf("}") + 1
            const jsonString = extractedText.slice(jsonStart, jsonEnd)

            const parsedData = JSON.parse(jsonString)

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
            })
        } catch (err) {
            setAnalysisError("Error during image analysis. Please try again.")
            console.error(err)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Sidebar header={'Patient Information'}>
            <Card >
                <Head title="Patient Information" />
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                            Please enter your data before accessing other menus. Thank you.
                        </AlertDescription>
                    </Alert>

                    <Tabs value={entryMethod} onValueChange={setEntryMethod} className="mb-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    value={data.nik}
                                    onChange={(e) => setData("nik", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                                {errors.nik && <p className="text-red-600">{errors.nik}</p>}
                            </div>
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                                {errors.name && <p className="text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                                {errors.email && <p className="text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="contact">Contact</Label>
                                <Input
                                    id="contact"
                                    value={data.contact}
                                    onChange={(e) => setData("contact", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                                {errors.contact && <p className="text-red-600">{errors.contact}</p>}
                            </div>
                            <div>
                                <Label htmlFor="place_of_birth">Place of Birth</Label>
                                <Input
                                    id="place_of_birth"
                                    value={data.place_of_birth}
                                    onChange={(e) => setData("place_of_birth", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData("date_of_birth", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    id="gender"
                                    value={data.gender}
                                    onChange={(e) => setData("gender", e.target.value)}
                                    className="w-full border rounded p-2"
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Select Gender</SelectLabel>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-red-600">{errors.gender}</p>}
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="rt_rw">RT/RW</Label>
                                <Input
                                    id="rt_rw"
                                    value={data.rt_rw}
                                    onChange={(e) => setData("rt_rw", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="village">Village</Label>
                                <Input
                                    id="village"
                                    value={data.village}
                                    onChange={(e) => setData("village", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="district">District</Label>
                                <Input
                                    id="district"
                                    value={data.district}
                                    onChange={(e) => setData("district", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="religion">Religion</Label>
                                <Input
                                    id="religion"
                                    value={data.religion}
                                    onChange={(e) => setData("religion", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="marital_status">Marital Status</Label>
                                <Input
                                    id="marital_status"
                                    value={data.marital_status}
                                    onChange={(e) => setData("marital_status", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="occupation">Occupation</Label>
                                <Input
                                    id="occupation"
                                    value={data.occupation}
                                    onChange={(e) => setData("occupation", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input
                                    id="nationality"
                                    value={data.nationality}
                                    onChange={(e) => setData("nationality", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="valid_until">Valid Until</Label>
                                <Input
                                    id="valid_until"
                                    value={data.valid_until}
                                    onChange={(e) => setData("valid_until", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label htmlFor="blood_type">Blood Type</Label>
                                <Input
                                    id="blood_type"
                                    value={data.blood_type}
                                    onChange={(e) => setData("blood_type", e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                        </div>
                        {!isReadOnly && (
                            <Button type="submit" disabled={processing} className="w-full">
                                Save
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
    )
}

