import React, { useState } from "react";
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";

import { Link, Head } from "@inertiajs/react";

export default function PaymentForm({ screening }) {

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Head title="Pembayaran" />
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <Link href={route('screening-online.index')}>
            <Button variant="ghost">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Pembayaran Screening</CardTitle>
          </div>
          <CardDescription>Pilih Metode Pembayaran</CardDescription>
        </CardHeader>
        </Card>
    </div>
  );
}

