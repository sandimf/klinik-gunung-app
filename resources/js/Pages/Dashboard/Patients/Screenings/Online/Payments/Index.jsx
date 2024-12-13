import React, { useState } from "react";
import { CreditCard, Wallet, Upload, ArrowLeft, Copy, Check } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link, Head, useForm } from "@inertiajs/react";

export default function PaymentForm({ screening }) {
  const [paymentType, setPaymentType] = useState("bank");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    patient_id: screening.id,
    screening_online_answer_id: screening.id || null,
    amount_paid: "26000",
    payment_method: "",
    payment_proof: null,
    qr_code: "",
  });

  const bankDetails = {
    bca: { name: "BCA", account: "1234567890" },
    mandiri: { name: "Mandiri", account: "0987654321" },
    bni: { name: "BNI", account: "1122334455" },
    bri: { name: "BRI", account: "5544332211" },
  };

  const eWalletDetails = {
    gopay: { name: "GoPay", number: "081234567890" },
    ovo: { name: "OVO", number: "081234567891" },
    dana: { name: "DANA", number: "081234567892" },
    linkaja: { name: "LinkAja", number: "081234567893" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('payments.online.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast({
          title: "Payment Submitted",
          description: "Your payment has been submitted successfully!",
          status: "success", // Tambahkan status untuk tipe notifikasi jika diperlukan
        });
      },
      onError: (errors) => {
        // Menampilkan toast untuk error
        toast({
          title: "Payment Failed",
          description: errors?.message || "An error occurred while submitting your payment. Please try again.",
          status: "error", // Tambahkan status untuk tipe notifikasi jika diperlukan
        });
  
        // Optional: Log error ke console untuk debugging
        console.error("Payment submission errors:", errors);
      },
    });
  };
  

  const handleFileChange = (e) => {
    setData('payment_proof', e.target.files[0]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Account/E-Wallet number copied to clipboard.",
    });
  };

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
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-6">
              <RadioGroup
                value={paymentType}
                onValueChange={setPaymentType}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                  <Label
                    htmlFor="bank"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    Bank Transfer
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="ewallet" id="ewallet" className="peer sr-only" />
                  <Label
                    htmlFor="ewallet"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Wallet className="mb-3 h-6 w-6" />
                    E-Wallet
                  </Label>
                </div>
              </RadioGroup>

              <div className="grid gap-2">
                <Label htmlFor="payment_method">
                  {paymentType === "bank" ? "Bank Name" : "E-Wallet Provider"}
                </Label>
                <Select 
                  onValueChange={(value) => setData('payment_method', value)}
                  value={data.payment_method}
                >
                  <SelectTrigger id="payment_method">
                    <SelectValue placeholder={`Select ${paymentType === "bank" ? "Bank" : "E-Wallet"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentType === "bank" ? (
                      <>
                        <SelectItem value="bca">BCA</SelectItem>
                        <SelectItem value="mandiri">Mandiri</SelectItem>
                        <SelectItem value="bni">BNI</SelectItem>
                        <SelectItem value="bri">BRI</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="gopay">GoPay</SelectItem>
                        <SelectItem value="ovo">OVO</SelectItem>
                        <SelectItem value="dana">DANA</SelectItem>
                        <SelectItem value="linkaja">LinkAja</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {data.payment_method && (
                <div className="grid gap-2 p-4 border rounded-md">
                  {paymentType === "bank" ? (
                    <>
                      <p className="font-semibold">{bankDetails[data.payment_method].name} Transfer Details:</p>
                      <div className="flex items-center justify-between">
                        <p>Account Number: {bankDetails[data.payment_method].account}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(bankDetails[data.payment_method].account)}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">{eWalletDetails[data.payment_method].name} Details:</p>
                      <div className="flex items-center justify-between">
                        <p>E-Wallet Number: {eWalletDetails[data.payment_method].number}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(eWalletDetails[data.payment_method].number)}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Pengirim Pembayaran</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment_proof">Upload Payment Proof</Label>
                <Input
                  id="payment_proof"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required
                />
                {data.payment_proof && (
                  <p className="text-sm text-muted-foreground">
                    File selected: {data.payment_proof.name}
                  </p>
                )}
                {errors.payment_proof && <p className="text-sm text-red-500">{errors.payment_proof}</p>}
              </div>
            </div>
          </CardContent>
          <Separator className="my-4" />
          <CardContent>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp 25.000</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rp 1.000</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rp 26.000</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={processing}>
              {processing ? (
                "Processing..."
              ) : (
                <>
                  Submit Payment (Rp 26.000)
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

