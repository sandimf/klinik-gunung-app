import { Card,CardHeader,CardFooter,CardTitle,CardDescription,CardContent } from "@/Components/ui/card"
import { Head,Link } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import React from "react"

export default function Qrcode({screening}){
    return (<div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Head title="QrCode" />
      <Card className="w-full max-w-3xl items-center">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-2xl items-center">QrCode</CardTitle>
          </div>
          <CardDescription>Datang ke Klinik Dan Minta Scan Kepada Admin</CardDescription>
        </CardHeader>
          <CardContent>
          <img src={`${screening.qrcode}`} alt="Payment Proof" />
          </CardContent>
          <CardFooter>

          </CardFooter>
      </Card>
    </div>)
    

}