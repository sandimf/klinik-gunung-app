import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Avatar, AvatarFallback } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import Sidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";

export default function PaymentsDetail({ screening, payment }) {

  const handleApprove = () => {
    router.post(route('payments.confirm', { id: payment.id }), {}, {
        onSuccess: () => {
            alert('Payment has been approved successfully!');
        },
    });
};
  return (
    <Sidebar header={'Payments Detail'}>
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{screening.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Patient Name</p>
              <p className="text-sm text-muted-foreground">{screening.name}</p>
            </div>
          </div>
          <div>
            <p className="font-medium">Account Name (Transferrer)</p>
            <p className="text-sm text-muted-foreground">{payment.name}</p>
          </div>
          <div>
            <p className="font-medium">Payment Method</p>
            <Badge variant="secondary">{payment.payment_method}</Badge>
          </div>
          <div>
            <p className="font-medium">Amount Paid</p>
            <p className="text-lg font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount_paid)}</p>
          </div>
          <div>
            <p className="font-medium mb-2">Payment Proof</p>
            <div className="w-48 h-48 relative">
              <img 
                src={`/storage/${payment.payment_proof}`} 
                alt="Payment Proof" 
                className="rounded-md shadow-md object-cover w-full h-full"
              />
            </div>
          </div>
        <Button
            onClick={handleApprove}
            className="bg-green-500 text-white px-4 py-2 rounded"
        >
            Approve Payment
        </Button>
        </CardContent>
      </Card>
    </div>
    </Sidebar>
  )
}

