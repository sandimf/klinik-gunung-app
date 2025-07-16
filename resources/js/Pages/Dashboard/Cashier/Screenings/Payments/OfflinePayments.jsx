import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
} from "@/Components/ui/command";

export default function PaymentDialog({
    isOpen,
    onClose,
    onPaymentSuccess,
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

    const { data, setData, post, processing, errors, reset } = useForm({
        cashier_id: cashier[0].id,
        patient_id: screening.id,
        payment_method: "",
        amount_paid: "",
        total_price_product: "",
        payment_proof: null,
        selected_medicine_id: "",
        medicine_batch_id: "",
        medicine_quantity: 1,
        selectedOptions: [],
    });

    const selectedMedicineDetails = medicines.find(
        (m) => m.id === parseInt(data.selected_medicine_id)
    );

    const medicineBatches = selectedMedicineDetails?.batches || [];

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            console.log("Dialog opened, resetting form");

            // delay sedikit agar dialog benar-benar mount sebelum reset
            setTimeout(() => {
                reset();
                setHasPurchasedProduct(false);
                setSelectedBatchId(null);
            }, 10);
        }
    }, [isOpen, reset]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit diklik", data);

        // Validasi
        if (hasPurchasedProduct && !data.selected_medicine_id) {
            toast.error("Silakan pilih obat terlebih dahulu.");
            return;
        }

        if (
            hasPurchasedProduct &&
            (!data.medicine_quantity || data.medicine_quantity <= 0)
        ) {
            toast.error("Jumlah obat harus lebih dari 0.");
            return;
        }

        if (hasPurchasedProduct && !data.medicine_batch_id) {
            toast.error("Silakan pilih batch obat.");
            return;
        }

        if (
            (data.payment_method === "qris" ||
                data.payment_method === "transfer") &&
            !data.payment_proof
        ) {
            toast.error("Bukti pembayaran diperlukan untuk metode ini.");
            return;
        }

        let submitData = {
            cashier_id: data.cashier_id,
            patient_id: data.patient_id,
            payment_method: data.payment_method,
            amount_paid: data.amount_paid,
            payment_proof: data.payment_proof,
            selectedOptions: data.selectedOptions,
            medicine_quantity: hasPurchasedProduct
                ? Number(data.medicine_quantity)
                : null,
            selected_medicine_id: hasPurchasedProduct
                ? data.selected_medicine_id
                : null,
            medicine_batch_id: hasPurchasedProduct
                ? data.medicine_batch_id
                : null,
        };

        console.log("Data yang akan dikirim:", submitData);
        console.log("Before post call");
        post(route("payments.store"), submitData, {
            preserveState: true,
            preserveScroll: false,
            onSuccess: (response) => {
                console.log("Payment success:", response);

                toast.success(`Pembayaran Berhasil di Proses`);

                // Langsung close dialog tanpa timeout
                console.log("Calling onClose");
                onClose();
                if (onPaymentSuccess) {
                    console.log("Calling onPaymentSuccess");
                    onPaymentSuccess();
                }
            },
            onError: (errors) => {
                console.log("Payment error:", errors);
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key]);
                });
            },
            onFinish: () => {
                console.log("Request finished");
            },
        });
        console.log("After post call");
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setData("payment_proof", file);
    };

    const handleClose = () => {
        console.log("Dialog close requested");
        onClose(); // ini HARUS mengubah isOpen jadi false di parent
    };

    const options = amounts.map((a) => ({
        value: a.id.toString(),
        label: `${a.type} - Rp ${parseInt(a.amount).toLocaleString("id-ID")}`,
    }));

    function MultiSelectScreening({ options, value, onChange }) {
        const [open, setOpen] = useState(false);

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
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                    >
                        {value.length > 0
                            ? (() => {
                                  const selectedLabels = options
                                      .filter((opt) =>
                                          value.includes(opt.value)
                                      )
                                      .map((opt) => opt.label);
                                  if (selectedLabels.length > 1) {
                                      return `${selectedLabels[0]} +${
                                          selectedLabels.length - 1
                                      } lainnya`;
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
                                    <Checkbox
                                        checked={value.includes(opt.value)}
                                        tabIndex={-1}
                                    />
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
    const totalScreening =
        data.selectedOptions.length > 0
            ? data.selectedOptions
                  .map((val) => {
                      const found = amounts.find(
                          (a) => a.id.toString() === val
                      );
                      return found ? parseInt(found.amount) : 0;
                  })
                  .reduce((a, b) => a + b, 0)
            : 0;

    const totalObat =
        hasPurchasedProduct && selectedMedicineDetails
            ? selectedMedicineDetails.pricing?.otc_price *
              data.medicine_quantity
            : 0;
    const finalTotalScreening = totalScreening + totalObat;

    useEffect(() => {
        setData("amount_paid", finalTotalScreening);
    }, [totalScreening, totalObat, setData]);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Formulir Pembayaran
                    </DialogTitle>
                    <DialogDescription>
                        Silakan isi form pembayaran untuk pasien{" "}
                        {screening.name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Metode Pembayaran */}
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

                    {/* Jenis Pelayanan */}
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
                            onChange={(vals) =>
                                setData("selectedOptions", vals)
                            }
                        />
                        {errors.amount_paid && (
                            <p className="text-red-500 text-sm">
                                {errors.amount_paid}
                            </p>
                        )}
                    </div>

                    {/* Checkbox untuk membeli obat */}
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

                    {/* Form obat jika checkbox dicentang */}
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
                                        onValueChange={(value) => {
                                            setData(
                                                "selected_medicine_id",
                                                value
                                            );
                                            setData("medicine_batch_id", "");
                                        }}
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

                                {medicineBatches.length > 0 && (
                                    <div className="mt-2">
                                        <Label
                                            htmlFor="medicine-batch"
                                            className="text-base font-semibold"
                                        >
                                            Pilih Batch Obat
                                        </Label>
                                        <Select
                                            value={data.medicine_batch_id}
                                            onValueChange={(value) =>
                                                setData(
                                                    "medicine_batch_id",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger id="medicine-batch">
                                                <SelectValue placeholder="Pilih Batch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {medicineBatches.map(
                                                    (batch) => (
                                                        <SelectItem
                                                            key={batch.id}
                                                            value={batch.id.toString()}
                                                        >
                                                            {batch.batch_number}{" "}
                                                            (Stok:{" "}
                                                            {batch.quantity})
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.medicine_batch_id && (
                                            <p className="text-red-500 text-sm">
                                                {errors.medicine_batch_id}
                                            </p>
                                        )}
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

                    {/* Bukti Pembayaran untuk QRIS/Transfer */}
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
                                type="file"
                                id="payment-proof"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {errors.payment_proof && (
                                <p className="text-red-500 text-sm">
                                    {errors.payment_proof}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Total Pembayaran */}
                    {finalTotalScreening > 0 && (
                        <div className="flex flex-col gap-2">
                            <Label className="text-base font-semibold">
                                Total Pembayaran
                            </Label>
                            <div className=" p-3 rounded-md">
                                {totalScreening > 0 && (
                                    <div className="flex justify-between">
                                        <span>Screening:</span>
                                        <span>
                                            Rp{" "}
                                            {totalScreening.toLocaleString(
                                                "id-ID"
                                            )}
                                        </span>
                                    </div>
                                )}
                                {totalObat > 0 && (
                                    <div className="flex justify-between">
                                        <span>Obat:</span>
                                        <span>
                                            Rp{" "}
                                            {totalObat.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total:</span>
                                    <span>
                                        Rp{" "}
                                        {finalTotalScreening.toLocaleString(
                                            "id-ID"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tombol */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || finalTotalScreening === 0}
                        >
                            {processing ? "Memproses..." : "Bayar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
