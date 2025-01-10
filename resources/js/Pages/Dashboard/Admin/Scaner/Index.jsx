import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function QrScanner() {
    const [scannedData, setScannedData] = useState("");
    const [decryptedData, setDecryptedData] = useState(null);
    const [error, setError] = useState("");
    const scannerRef = useRef(null);

    const handleScanSuccess = async (decodedText) => {
        if (decodedText) {
            setScannedData(decodedText);
            try {
                // Kirim data terenkripsi ke server untuk didekripsi
                const response = await axios.post(route('decrypt.scan'), {
                    encryptedData: decodedText,
                });
    
                if (response.data.success) {
                    setDecryptedData(response.data.data); // Simpan hasil dekripsi
                    setError(""); // Reset error
    
                    // Menampilkan pesan bahwa screening telah selesai
                    alert('Screening status telah diperbarui menjadi completed.');
                } else {
                    setError("Gagal mendekripsi QR code.");
                    setDecryptedData(null); // Reset hasil dekripsi jika gagal
                }
            } catch (err) {
                console.error(err);
                setError("Gagal mendekripsi QR code.");
                setDecryptedData(null); // Reset hasil dekripsi jika gagal
            }
        }
    };

    const handleScanFailure = (errorMessage) => {
        console.warn("Scan gagal:", errorMessage);
    };

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: 250 };

        html5QrCode
            .start(
                { facingMode: "environment" },
                config,
                handleScanSuccess,
                handleScanFailure
            )
            .catch((err) => {
                console.error("Camera start error:", err);
                setError("Tidak bisa mengakses kamera.");
            });

        return () => {
            html5QrCode.stop().then(() => {
                console.log("Camera stopped.");
            });
        };
    }, []);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Head title="Scan QR Code" />
            <div className="w-full max-w-2xl p-4 bg-white shadow rounded">
                <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
                <div id="reader" style={{ width: "100%" }}></div>
                {scannedData && (
                    <div className="mt-4 p-4 bg-gray-100 rounded">
                        <h3 className="text-lg font-bold">Hasil Scan:</h3>
                        <p className="text-sm text-gray-700">
                            <strong>Data Terenkripsi:</strong> {scannedData}
                        </p>
                    </div>
                )}
                {decryptedData && (
                    <div className="mt-4 p-4 bg-green-100 rounded">
                        <h3 className="text-lg font-bold">Hasil Dekripsi:</h3>
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                            {JSON.stringify(decryptedData, null, 2)}
                        </pre>
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 rounded">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
