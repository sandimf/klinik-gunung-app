import React, { useState } from "react";
import { Camera, Upload, RefreshCw, Check } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function ReceiptScanner() {
    const [image, setImage] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleImageCapture = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            await processReceipt(file);
        }
    };

    const processReceipt = async (file) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append("receipt", file);

            const response = await fetch("/api/scan-receipt", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setExtractedText(data.text);
        } catch (error) {
            console.error("Error processing receipt:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Receipt Scanner</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-md aspect-[3/4] border-2 border-dashed rounded-lg overflow-hidden">
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Receipt"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex absolute inset-0 justify-center items-center">
                                        <p className="text-gray-500">
                                            Upload or capture receipt
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center space-x-2">
                            <Button variant="outline" className="w-40">
                                <label className="flex justify-center items-center space-x-2 cursor-pointer">
                                    <Camera className="w-4 h-4" />
                                    <span>Capture</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={handleImageCapture}
                                    />
                                </label>
                            </Button>

                            <Button variant="outline" className="w-40">
                                <label className="flex justify-center items-center space-x-2 cursor-pointer">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageCapture}
                                    />
                                </label>
                            </Button>
                        </div>

                        {isProcessing && (
                            <div className="flex justify-center items-center space-x-2 text-gray-500">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Processing receipt...</span>
                            </div>
                        )}

                        {extractedText && (
                            <div className="mt-4">
                                <h3 className="mb-2 font-semibold">
                                    Extracted Information
                                </h3>
                                <pre className="overflow-x-auto p-4 bg-gray-100 rounded-lg">
                                    {extractedText}
                                </pre>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
