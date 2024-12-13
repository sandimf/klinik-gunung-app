'use client'

import React, { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Alert, AlertDescription } from "@/Components/ui/alert"

const ImageAnalysis = () => {
  const [imageFile, setImageFile] = useState(null)
  const [extractedData, setExtractedData] = useState({})
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const genAI = new GoogleGenerativeAI("API_KEY")
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) setImageFile(file)
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const analyzeImage = async () => {
    if (!imageFile) {
      setError("Please select an image to analyze.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const base64Image = await fileToBase64(imageFile);
  
      const prompt = `
        Analyze this KTP (Indonesian ID card) image and extract the following information:
        - NIK (ID Number)
        - Nama (Name)
        - Tempat/Tgl Lahir (Place/Date of Birth)
        - Jenis Kelamin (Gender)
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
        { inlineData: { data: base64Image.split(",")[1], mimeType: imageFile.type } }
      ]);
  
      const extractedText = result.response.text();
      
      // Extract JSON content from the response text (remove code block)
      const jsonStart = extractedText.indexOf("{");
      const jsonEnd = extractedText.lastIndexOf("}") + 1;
      const jsonString = extractedText.slice(jsonStart, jsonEnd);
  
      // Parse the JSON string
      const parsedData = JSON.parse(jsonString);
  
      setExtractedData(parsedData);
    } catch (err) {
      setError("Error during image analysis. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">KTP Image Analysis with Gemini</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <Button
          onClick={analyzeImage}
          disabled={!imageFile || isLoading}
          className="w-full"
        >
          {isLoading ? "Extracting..." : "Extract Text"}
        </Button>

        <div className="mt-4 space-y-4">
          {Object.entries(extractedData).map(([key, value]) => (
            <div key={key}>
              <label className="block font-medium">{key}:</label>
              <Input
                type="text"
                value={value}
                readOnly
                className="bg-gray-100"
              />
            </div>
          ))}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default ImageAnalysis
