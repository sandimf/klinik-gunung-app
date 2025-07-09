import React, { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Head } from "@inertiajs/react"
import axios from "axios"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Alert, AlertDescription } from "@/Components/ui/alert"

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
          setIsDialogOpen(true)
        } else {
          setError("Gagal mendekripsi QR code.")
          setDecryptedData(null)
        }
      } catch (err) {
        setError("Gagal mendekripsi QR code.")
        setDecryptedData(null)
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
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Scan QR Code</CardTitle>
          <Button variant="outline" size="sm" onClick={handleGoBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </CardHeader>
        <CardContent>
          <div id="reader" style={{ width: "100%" }}></div>
          {scannedData && (
            <Alert className="mt-4" variant="default">
              <AlertDescription>
                <span className="font-semibold">Data Terenkripsi:</span> {scannedData}
              </AlertDescription>
            </Alert>
          )}
          {decryptedData && (
            <Alert className="mt-4" variant="success">
              <AlertDescription>
                <span className="font-semibold">Hasil Dekripsi:</span>
                <pre className="text-sm text-gray-800 whitespace-pre-wrap mt-2">{JSON.stringify(decryptedData, null, 2)}</pre>
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Berhasil</DialogTitle>
            <DialogDescription>QR code berhasil di-scan dan didekripsi.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Screening status telah diperbarui menjadi <span className="font-semibold">completed</span>.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

