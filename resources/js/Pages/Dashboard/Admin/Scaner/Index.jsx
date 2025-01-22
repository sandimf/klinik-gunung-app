import React, { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Head } from "@inertiajs/react"
import axios from "axios"
import { toast, Toaster } from "sonner"
import { Button } from "@/Components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog"

export default function QrScanner() {
  const [scannedData, setScannedData] = useState("")
  const [decryptedData, setDecryptedData] = useState(null)
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const scannerRef = useRef(null)

  const handleScanSuccess = async (decodedText) => {
    if (decodedText) {
      setScannedData(decodedText)
      try {
        const response = await axios.post(route("decrypt.scan"), {
          encryptedData: decodedText,
        })

        if (response.data.success) {
          setDecryptedData(response.data.data)
          setError("")

          toast.success("QR code berhasil di-scan.")
          setIsDialogOpen(true)
        } else {
          setError("Gagal mendekripsi QR code.")
          setDecryptedData(null)
          toast.error("Gagal mendekripsi QR code.")
        }
      } catch (err) {
        setError("Gagal mendekripsi QR code.")
        setDecryptedData(null)
        toast.error("Terjadi kesalahan saat memproses QR code.")
      }
    }
  }

  const handleScanFailure = (errorMessage) => {
    // toast.error("Scan gagal: " + errorMessage)
  }

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader")
    const config = { fps: 10, qrbox: 250 }

    html5QrCode.start({ facingMode: "environment" }, config, handleScanSuccess, handleScanFailure).catch((err) => {
      console.error("Camera start error:", err)
      setError("Tidak bisa mengakses kamera.")
      toast.error("Tidak bisa mengakses kamera.")
    })

    return () => {
      html5QrCode.stop().then(() => {
        console.log("Camera stopped.")
      })
    }
  }, [])

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Head title="Scan QR Code" />
      <div className="w-full max-w-2xl p-4 bg-white shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Scan QR Code</h2>
          <Button variant="outline" size="sm" onClick={handleGoBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
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
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(decryptedData, null, 2)}</pre>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
      <Toaster />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Berhasil</DialogTitle>
            <DialogDescription>QR code berhasil di-scan dan didekripsi.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Screening status telah diperbarui menjadi completed.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

