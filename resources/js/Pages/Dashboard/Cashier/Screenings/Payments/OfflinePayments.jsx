import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { useForm, usePage } from "@inertiajs/react";
import { CheckCircle2 } from "lucide-react";
import ReactSelect from 'react-select';
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/Components/ui/command";

export default function PaymentDialog({
    isOpen,
    onClose,
    medicines,
    screening,
    amounts = [],
}) {
    if (!screening) {
        return null;
    }

    const { auth } = usePage().props;

    const cashier = auth.cashier;

    const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        cashier_id: cashier[0].id,
        patient_id: screening.id,
        payment_method: "",
        amount_paid: "",
        quantity_product: "",
        total_price_product: "",
        payment_proof: null,
        selected_medicine_id: null,
        medicine_quantity: 1,
        selectedOptions: [],
    });

    // Ensure selectedMedicineDetails is defined before accessing its properties
    const selectedMedicineDetails = medicines.find(
        (m) => m.id === parseInt(data.selected_medicine_id)
    );

    // Only calculate the total price if selectedMedicineDetails exists
    const medicineTotalPrice = selectedMedicineDetails
        ? selectedMedicineDetails.pricing?.otc_price * data.medicine_quantity
        : 0;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi tambahan
        if (hasPurchasedProduct && !data.selected_medicine_id) {
            toast.error("Silakan pilih obat terlebih dahulu.");
            return;
        }

        if (hasPurchasedProduct && (!data.medicine_quantity || data.medicine_quantity <= 0)) {
            toast.error("Jumlah obat harus lebih dari 0.");
            return;
        }

        if ((data.payment_method === "qris" || data.payment_method === "transfer") && !data.payment_proof) {
            toast.error("Bukti pembayaran diperlukan untuk metode ini.");
            return;
        }

        // Buat submitData langsung dengan field penting
        let submitData = {
            cashier_id: data.cashier_id,
            patient_id: data.patient_id,
            payment_method: data.payment_method,
            amount_paid: data.amount_paid,
            payment_proof: data.payment_proof,
            selectedOptions: data.selectedOptions,
            quantity_product: hasPurchasedProduct ? parseInt(data.medicine_quantity) : null,
            selected_medicine_id: hasPurchasedProduct ? data.selected_medicine_id : null,
        };

        console.log('Data yang akan dikirim:', submitData);

        post(route("payments.store"), submitData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onClose(); // Tutup dialog lebih awal
                toast.success(`Pembayaran Berhasil di Proses`, {
                    icon: <CheckCircle2 />,
                });
            },
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key]);
                });
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setData("payment_proof", file);
    };

    // Ensure otcPrice and finalTotal are only calculated if selectedMedicineDetails is not undefined
    const otcPrice = selectedMedicineDetails
        ? parseFloat(selectedMedicineDetails.pricing?.otc_price)
        : 0;
    const screeningPrice = parseInt(data.amount_paid) || 0;
    const productTotalPrice = parseInt(data.total_price_product) || 0;
    const finalTotal = screeningPrice + productTotalPrice + medicineTotalPrice;

    const options = amounts.map(a => ({
        value: `${a.type}|${a.amount}`,
        label: `${a.type} - Rp ${parseInt(a.amount).toLocaleString("id-ID")}`
    }));

    function MultiSelectScreening({ options, value, onChange }) {
        const [open, setOpen] = React.useState(false);
        const handleSelect = (val) => {
            if (value.includes(val)) {
                onChange(value.filter((v) => v !== val));
            } else {
                onChange([...value, val]);
            }
        };
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        {value.length > 0
                            ? (() => {
                                const selectedLabels = options.filter((opt) => value.includes(opt.value)).map((opt) => opt.label);
                                if (selectedLabels.length > 1) {
                                    return `${selectedLabels[0]} +${selectedLabels.length - 1} lainnya`;
                                }
                                return selectedLabels[0];
                            })()
                            : "Pilih harga screening"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Cari..." />
                        <CommandList>
                            {options.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    onSelect={() => handleSelect(opt.value)}
                                    className="flex items-center gap-2"
                                >
                                    <Checkbox checked={value.includes(opt.value)} tabIndex={-1} />
                                    <span>{opt.label}</span>
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }

    // Hitung total screening
    const totalScreening = data.selectedOptions.length > 0
        ? data.selectedOptions
            .map(val => parseInt(val.split("|")[1]))
            .reduce((a, b) => a + b, 0)
        : 0;
    // Hitung total obat
    const totalObat = hasPurchasedProduct && selectedMedicineDetails
        ? selectedMedicineDetails.pricing?.otc_price * data.medicine_quantity
        : 0;
    const finalTotalScreening = totalScreening + totalObat;

    useEffect(() => {
        setData("amount_paid", finalTotalScreening);
    }, [totalScreening, totalObat]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Formulir Pembayaran
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="payment-method"
                            className="text-base font-semibold"
                        >
                            Metode Pembayaran
                        </Label>
                        <RadioGroup
                            id="payment-method"
                            value={data.payment_method}
                            onValueChange={(value) =>
                                setData("payment_method", value)
                            }
                            className="flex flex-col gap-2"
                        >
                            {["qris", "cash", "transfer"].map((method) => (
                                <div
                                    key={method}
                                    className="flex items-center gap-2"
                                >
                                    <RadioGroupItem
                                        value={method}
                                        id={method}
                                    />
                                    <Label htmlFor={method}>
                                        {method.toUpperCase()}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.payment_method && (
                            <p className="text-red-500 text-sm">
                                {errors.payment_method}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="price"
                            className="text-base font-semibold"
                        >
                            Jenis Pelayanan
                        </Label>
                        <MultiSelectScreening
                            options={options}
                            value={data.selectedOptions}
                            onChange={vals => setData("selectedOptions", vals)}
                        />
                        {errors.amount_paid && (
                            <p className="text-red-500 text-sm">
                                {errors.amount_paid}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="buy-product"
                            checked={hasPurchasedProduct}
                            onCheckedChange={() =>
                                setHasPurchasedProduct(!hasPurchasedProduct)
                            }
                        />
                        <Label
                            htmlFor="buy-product"
                            className="text-base font-semibold"
                        >
                            Apakah pasien membeli obat?
                        </Label>
                    </div>

                    {hasPurchasedProduct && (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="medicine"
                                    className="text-base font-semibold"
                                >
                                    Pilih Obat
                                </Label>
                                {medicines.length === 0 ? (
                                    <p className="text-red-500">
                                        Belum ada obat
                                    </p>
                                ) : (
                                    <Select
                                        value={data.selected_medicine_id}
                                        onValueChange={(value) =>
                                            setData(
                                                "selected_medicine_id",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger id="medicine">
                                            <SelectValue placeholder="Pilih Obat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {medicines.map((medicine) => (
                                                <SelectItem
                                                    key={medicine.id}
                                                    value={medicine.id.toString()}
                                                >
                                                    {medicine.medicine_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {selectedMedicineDetails && (
                                    <div className="mt-4 space-y-2">
                                        <p>
                                            <strong>Stok Tersedia:</strong>{" "}
                                            {selectedMedicineDetails.quantity}
                                        </p>
                                        <p>
                                            <strong>Harga OTC:</strong>{" "}
                                            {otcPrice.toLocaleString("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="medicine-quantity"
                                    className="text-base font-semibold"
                                >
                                    Jumlah Obat
                                </Label>
                                <Input
                                    type="number"
                                    id="medicine-quantity"
                                    value={data.medicine_quantity}
                                    onChange={(e) =>
                                        setData(
                                            "medicine_quantity",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Masukkan jumlah obat"
                                    min="1"
                                />
                                {errors.medicine_quantity && (
                                    <p className="text-red-500 text-sm">
                                        {errors.medicine_quantity}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Rincian Pembayaran */}
                    {finalTotalScreening > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Rincian Pembayaran</h3>
                            <p>Harga Screening: Rp {totalScreening.toLocaleString("id-ID")}</p>
                            {totalObat > 0 && (
                                <p>Harga Obat: Rp {totalObat.toLocaleString("id-ID")}</p>
                            )}
                            <div className="font-bold mt-2">
                                Total Pembayaran: Rp {finalTotalScreening.toLocaleString("id-ID")}
                            </div>
                        </div>
                    )}
                    {(data.payment_method === "qris" ||
                        data.payment_method === "transfer") && (
                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="payment-proof"
                                    className="text-base font-semibold"
                                >
                                    Bukti Pembayaran
                                </Label>
                                <Input
                                    id="payment-proof"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                />
                                {errors.payment_proof && (
                                    <p className="text-red-500 text-sm">
                                        {errors.payment_proof}
                                    </p>
                                )}
                            </div>
                        )}
                    <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={processing}
                    >
                        {processing ? "Memproses..." : "Bayar Sekarang"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

