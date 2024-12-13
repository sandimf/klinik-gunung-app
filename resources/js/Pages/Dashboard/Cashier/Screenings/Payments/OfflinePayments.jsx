import React, { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { useForm } from '@inertiajs/react';

export default function PaymentDialog({ isOpen, onClose, medicines, screening }) {
    if (!screening) {
        return null;
    }
    console.log('Screening Data:', screening);
    const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        patient_id: screening.id,
        payment_method: "",
        amount_paid: "",
        quantity_product: "",
        total_price_product: "",
        payment_proof: null,
        selected_medicine_id: null,
        medicine_quantity: 1,

    });

    // Ensure selectedMedicineDetails is defined before accessing its properties
    const selectedMedicineDetails = medicines.find(m => m.id === parseInt(data.selected_medicine_id));

    // Only calculate the total price if selectedMedicineDetails exists
    const medicineTotalPrice = selectedMedicineDetails
        ? selectedMedicineDetails.pricing?.otc_price * data.medicine_quantity
        : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((data.payment_method === "qris" || data.payment_method === "transfer") && !data.payment_proof) {
            toast.error("Bukti pembayaran diperlukan untuk metode ini.");
            return;
        }

        post(route('payments.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Pembayaran berhasil diproses.");
                onClose();
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setData("payment_proof", file);
    };

    // Ensure otcPrice and finalTotal are only calculated if selectedMedicineDetails is not undefined
    const otcPrice = selectedMedicineDetails ? parseFloat(selectedMedicineDetails.pricing?.otc_price) : 0;
    const screeningPrice = parseInt(data.amount_paid) || 0;
    const productTotalPrice = parseInt(data.total_price_product) || 0;
    const finalTotal = screeningPrice + productTotalPrice + medicineTotalPrice;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Formulir Pembayaran
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="payment-method" className="text-base font-semibold">
                            Metode Pembayaran
                        </Label>
                        <RadioGroup
                            id="payment-method"
                            value={data.payment_method}
                            onValueChange={(value) => setData("payment_method", value)}
                            className="flex flex-col space-y-2"
                        >
                            {["qris", "cash", "transfer"].map((method) => (
                                <div key={method} className="flex items-center space-x-2">
                                    <RadioGroupItem value={method} id={method} />
                                    <Label htmlFor={method}>{method.toUpperCase()}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.payment_method && <p className="text-red-500 text-sm">{errors.payment_method}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-base font-semibold">
                            Harga Screening
                        </Label>
                        <Select
                            value={data.amount_paid}
                            onValueChange={(value) => setData("amount_paid", value)}
                        >
                            <SelectTrigger id="price">
                                <SelectValue placeholder="Pilih harga" />
                            </SelectTrigger>
                            <SelectContent>
                                {[50000, 100000, 150000, 200000].map((price) => (
                                    price != null ? (
                                        <SelectItem key={price} value={price.toString()}>
                                            Rp {price.toLocaleString("id-ID")}
                                        </SelectItem>
                                    ) : null
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.amount_paid && <p className="text-red-500 text-sm">{errors.amount_paid}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="buy-product"
                            checked={hasPurchasedProduct}
                            onCheckedChange={() => setHasPurchasedProduct(!hasPurchasedProduct)}
                        />
                        <Label htmlFor="buy-product" className="text-base font-semibold">
                            Apakah pasien membeli obat?
                        </Label>
                    </div>

                    {hasPurchasedProduct && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="medicine" className="text-base font-semibold">
                                    Pilih Obat
                                </Label>
                                <Select
                                    value={data.selected_medicine_id}
                                    onValueChange={(value) => setData("selected_medicine_id", value)}
                                >
                                    <SelectTrigger id="medicine">
                                        <SelectValue placeholder="Pilih Obat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {medicines.map((medicine) => (
                                            <SelectItem
                                            key={medicine.id}
                                            value={medicine.id.toString()}>
                                                {medicine.medicine_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedMedicineDetails && (
                                    <div className="mt-4 space-y-2">
                                        <p><strong>Stok Tersedia:</strong> {selectedMedicineDetails.quantity}</p>
                                        <p><strong>Harga OTC:</strong> {otcPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="medicine-quantity" className="text-base font-semibold">
                                    Jumlah Obat
                                </Label>
                                <Input
                                    type="number"
                                    id="medicine-quantity"
                                    value={data.medicine_quantity}
                                    onChange={(e) => setData("medicine_quantity", e.target.value)}
                                    placeholder="Masukkan jumlah obat"
                                    min="1"
                                />
                                {errors.medicine_quantity && <p className="text-red-500 text-sm">{errors.medicine_quantity}</p>}
                            </div>
                        </div>
                    )}

                    {data.amount_paid && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Rincian Pembayaran</h3>
                            <p>Harga Screening: Rp {screeningPrice.toLocaleString("id-ID")}</p>
                            {hasPurchasedProduct && selectedMedicineDetails && (
                                <>
                                    <p>Harga Obat: Rp {medicineTotalPrice.toLocaleString("id-ID")}</p>
                                    <p className="font-bold">Total Pembayaran: Rp {finalTotal.toLocaleString("id-ID")}</p>
                                </>
                            )}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? "Memproses..." : "Bayar Sekarang"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
