import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/Components/ui/card"
import { Head, Link } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import React from "react"

export default function Qrcode({ screening }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Head title="QR Code Screening" />
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Screening QR Code</CardTitle>
          <CardDescription className="text-lg mt-2">
            Qrcode Hanya Berlaku Sekali Scan Saja.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={`${screening.qrcode}`}
              alt="Screening QR Code"
              className="w-64 h-64 object-contain"
            />
          </div>
          
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href={route('screening-online.index')}>Kembali</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

