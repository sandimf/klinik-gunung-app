import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/Components/ui/dialog";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/Components/ui/radio-group";
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
import { MultiSelect } from "@/Components/ui/MultiSelect";
import { MinusSquare, Plus } from "lucide-react";

export default function PaymentDialog({
    isOpen,
    setIsOpen,
    onSuccess,
    medicines,
    screening,
    amounts = [],
    products = [], // Tambahkan props products
    onPaymentSuccess,
}) {
    const { auth } = usePage().props;
    const cashier = auth.cashier;
    const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false); // untuk obat
    const [hasPurchasedOtherProduct, setHasPurchasedOtherProduct] = useState(false); // untuk produk
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const { flash } = usePage().props;
    const [selectedProducts, setSelectedProducts] = useState([]); // [{product_id, name, quantity, stock}]
    const [selectedProductId, setSelectedProductId] = useState("");
    const [productQuantity, setProductQuantity] = useState(1);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        cashier_id: cashier[0].id,
        patient_id: screening?.id || "",
        payment_method: "",
        amount_paid: "",
        total_price_product: "",
        payment_proof: null,
        selected_medicine_id: "",
        medicine_batch_id: "",
        medicine_quantity: 1,
        selectedOptions: [],
        selected_products: [], // Tambahkan selected_products ke data useForm
    });

    const selectedMedicineDetails = medicines.find(
        (m) => m.id === parseInt(data.selected_medicine_id)
    );
    const medicineBatches = selectedMedicineDetails?.batches || [];
    const medicineTotalPrice = selectedMedicineDetails
        ? selectedMedicineDetails.pricing?.otc_price * data.medicine_quantity
        : 0;

    const totalScreening = data.selectedOptions.length > 0
        ? data.selectedOptions
            .map((val) => {
                const found = amounts.find((a) => a.id.toString() === val);
                return found ? parseInt(found.amount) : 0;
            })
            .reduce((a, b) => a + b, 0)
        : 0;

    // Hitung subtotal produk
    const totalProduk = selectedProducts.reduce((sum, p) => {
        const prod = products.find(pr => pr.id === p.product_id);
        return sum + (prod ? prod.price * p.quantity : 0);
    }, 0);
    // Hitung subtotal layanan
    const layananRincian = data.selectedOptions.map(val => {
        const found = amounts.find(a => a.id.toString() === val);
        return found ? { label: found.type, price: parseInt(found.amount) } : null;
    }).filter(Boolean);
    const totalLayanan = layananRincian.reduce((sum, l) => sum + l.price, 0);
    // Hitung subtotal obat
    const obatRincian = hasPurchasedProduct && selectedMedicineDetails ? {
        name: selectedMedicineDetails.medicine_name,
        price: selectedMedicineDetails.pricing?.otc_price || 0,
        qty: data.medicine_quantity,
        subtotal: (selectedMedicineDetails.pricing?.otc_price || 0) * data.medicine_quantity
    } : null;
    const totalObat = obatRincian ? obatRincian.subtotal : 0;
    // Hitung total keseluruhan
    const grandTotal = totalLayanan + totalObat + totalProduk;

    useEffect(() => {
        setData("amount_paid", grandTotal);
    }, [totalLayanan, totalObat, totalProduk]);

    useEffect(() => {
        setData("selected_products", selectedProducts.map(p => ({ product_id: p.product_id, quantity: p.quantity })));
    }, [selectedProducts]);

    // Reset selectedProducts jika checkbox produk di-uncheck
    useEffect(() => {
        if (!hasPurchasedOtherProduct) {
            setSelectedProducts([]);
        }
    }, [hasPurchasedOtherProduct]);

    // Sinkronkan ke form data
    useEffect(() => {
        setData("selected_products", hasPurchasedOtherProduct ? selectedProducts.map(p => ({ product_id: p.product_id, quantity: p.quantity })) : []);
    }, [selectedProducts, hasPurchasedOtherProduct]);

    // Handler tambah produk ke list
    const handleAddProduct = () => {
        if (!selectedProductId) return;
        const product = products.find(p => p.id.toString() === selectedProductId);
        if (!product) return;
        const qty = parseInt(productQuantity);
        if (isNaN(qty) || qty < 1) {
            toast.error("Jumlah produk harus lebih dari 0.");
            return;
        }
        // Cari produk di daftar belanja
        const existing = selectedProducts.find(p => p.product_id === product.id);
        const totalQuantity = (existing ? existing.quantity : 0) + qty;
        if (totalQuantity > product.stock) {
            toast.error(`Jumlah total melebihi stok tersedia (${product.stock}).`);
            return;
        }
        if (existing) {
            setSelectedProducts(selectedProducts.map(p =>
                p.product_id === product.id
                    ? { ...p, quantity: p.quantity + qty }
                    : p
            ));
        } else {
            setSelectedProducts([
                ...selectedProducts,
                { product_id: product.id, name: product.name, quantity: qty, stock: product.stock }
            ]);
        }
        setSelectedProductId("");
        setProductQuantity(1);
    };

    // Handler hapus produk dari list
    const handleRemoveProduct = (id) => {
        setSelectedProducts(prev => prev.filter(p => p.product_id !== id));
    };

    // Handler untuk membuka dialog konfirmasi
    const handleShowConfirm = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    // Handler submit final setelah konfirmasi
    const handleConfirmPayment = () => {
        setShowConfirm(false);
        post(route("payments.store"), {
            ...data,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
                if (onSuccess) onSuccess();
                if (onPaymentSuccess) onPaymentSuccess();
            },
            onError: (errors) => {
                console.error("Payment error:", errors);
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setData("payment_proof", file);
    };

    const options = amounts.map((a) => ({
        value: a.id.toString(),
        label: `${a.type} - Rp ${parseInt(a.amount).toLocaleString("id-ID")}`,
    }));

    if (!screening) return null;

    useEffect(() => {
        if (flash?.success && isOpen) {
            // Jika ada flash success dan dialog masih terbuka, tutup dialogs
            setTimeout(() => {
                setIsOpen(false);
                onSuccess?.();
                onPaymentSuccess?.();
                reset();
            }, 100); // Delay sedikit untuk memastikan response sudah diproses
        }
    }, [flash?.success, isOpen]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">
                            Formulir Pembayaran
                        </DialogTitle>
                        <DialogDescription>
                            Silakan lengkapi detail pembayaran pasien di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleShowConfirm} className="space-y-6">
                        {/* Metode Pembayaran */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="payment-method">Metode Pembayaran</Label>
                            <RadioGroup
                                value={data.payment_method}
                                onValueChange={(value) => setData("payment_method", value)}
                            >
                                {["qris", "cash", "transfer"].map((method) => (
                                    <div key={method} className="flex items-center gap-2">
                                        <RadioGroupItem value={method} id={method} />
                                        <Label htmlFor={method}>{method.toUpperCase()}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            {errors.payment_method && <p className="text-red-500 text-sm">{errors.payment_method}</p>}
                        </div>

                        {/* Jenis Pelayanan */}
                        <div className="flex flex-col gap-2">
                            <Label>Jenis Pelayanan</Label>
                            <MultiSelect
                                options={options}
                                onValueChange={(vals) => setData("selectedOptions", vals)}
                                defaultValue={data.selectedOptions}
                                placeholder="Pilih jenis pelayanan"
                            />
                        </div>

                        {/* Checkbox beli obat */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="buy-medicine"
                                checked={hasPurchasedProduct}
                                onCheckedChange={() => setHasPurchasedProduct(!hasPurchasedProduct)}
                            />
                            <Label htmlFor="buy-medicine">Apakah pasien membeli obat?</Label>
                        </div>

                        {/* Form Obat */}
                        {hasPurchasedProduct && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Validasi jika tidak ada obat */}
                                {medicines.length === 0 ? (
                                    <div className="text-red-500 text-sm font-semibold col-span-2">Belum ada obat saat ini</div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="medicine">Pilih Obat</Label>
                                            <Select
                                                value={data.selected_medicine_id}
                                                onValueChange={(value) => {
                                                    setData("selected_medicine_id", value);
                                                    setData("medicine_batch_id", "");
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Obat" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {medicines.map((medicine) => (
                                                        <SelectItem key={medicine.id} value={medicine.id.toString()}>
                                                            {medicine.medicine_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {medicineBatches.length > 0 && (
                                            <div>
                                                <Label htmlFor="medicine-batch">Pilih Batch Obat</Label>
                                                <Select
                                                    value={data.medicine_batch_id}
                                                    onValueChange={(value) => setData("medicine_batch_id", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Batch" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {medicineBatches.map((batch) => (
                                                            <SelectItem key={batch.id} value={batch.id.toString()}>
                                                                {batch.batch_number} (Stok: {batch.quantity})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor="medicine-quantity">Jumlah Obat</Label>
                                            <Input
                                                type="number"
                                                id="medicine-quantity"
                                                value={data.medicine_quantity}
                                                onChange={(e) => setData("medicine_quantity", e.target.value)}
                                                min="1"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Checkbox beli produk */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="buy-product-confirm"
                                checked={hasPurchasedOtherProduct}
                                onCheckedChange={() => setHasPurchasedOtherProduct(!hasPurchasedOtherProduct)}
                            />
                            <Label htmlFor="buy-product-confirm">Apakah pasien membeli produk?</Label>
                        </div>

                        {/* Form Produk */}
                        {hasPurchasedOtherProduct && (
                            <div className="flex flex-col gap-2">
                                <Label>Produk Lainnya</Label>
                                <div className="flex gap-2 items-end">
                                    <Select
                                        value={selectedProductId}
                                        onValueChange={setSelectedProductId}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Pilih Produk" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name} (Stok: {product.stock})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        min="1"
                                        className="w-20"
                                        value={productQuantity}
                                        onChange={e => setProductQuantity(e.target.value)}
                                        placeholder="Jumlah"
                                    />
                                    <Button type="button" onClick={handleAddProduct} variant="secondary"><Plus /></Button>
                                </div>
                                {/* Daftar produk yang akan dibeli */}
                                {selectedProducts.length > 0 && (
                                    <ul className="mt-2 text-sm">
                                        {selectedProducts.map((prod, idx) => (
                                            <li key={prod.product_id} className="flex items-center gap-2">
                                                {prod.name} x {prod.quantity}
                                                <Button type="button" size="sm" variant="secondary" onClick={() => handleRemoveProduct(prod.product_id)}>
                                                    <MinusSquare />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Bukti Pembayaran */}
                        {(data.payment_method === "qris" || data.payment_method === "transfer") && (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="payment-proof">Bukti Pembayaran</Label>
                                <Input
                                    id="payment-proof"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                />
                            </div>
                        )}

                        {/* Ringkasan Total */}
                        {(grandTotal > 0) && (
                            <div className="rounded-md border p-4 bg-muted/50">
                                <h3 className="font-semibold">Rincian Pembayaran</h3>
                                {/* Layanan */}
                                {layananRincian.length > 0 && (
                                    <div>
                                        <div className="font-medium">Jenis Pelayanan:</div>
                                        <ul className="ml-2">
                                            {layananRincian.map((l, idx) => (
                                                <li key={idx}>{l.label} - Rp {l.price.toLocaleString("id-ID")}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Obat */}
                                {obatRincian && (
                                    <div className="mt-1">
                                        <div className="font-medium">Obat:</div>
                                        <ul className="ml-2">
                                            <li>{obatRincian.name} x {obatRincian.qty} - Rp {obatRincian.price.toLocaleString("id-ID")} = Rp {obatRincian.subtotal.toLocaleString("id-ID")}</li>
                                        </ul>
                                    </div>
                                )}
                                {/* Produk */}
                                {selectedProducts.length > 0 && (
                                    <div className="mt-1">
                                        <div className="font-medium">Produk:</div>
                                        <ul className="ml-2">
                                            {selectedProducts.map((prod, idx) => {
                                                const p = products.find(pr => pr.id === prod.product_id);
                                                return p ? (
                                                    <li key={prod.product_id}>{p.name} x {prod.quantity} - Rp {p.price.toLocaleString("id-ID")} = Rp {(p.price * prod.quantity).toLocaleString("id-ID")}</li>
                                                ) : null;
                                            })}
                                        </ul>
                                    </div>
                                )}
                                <p className="font-bold mt-2">Total: Rp {grandTotal.toLocaleString("id-ID")}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <Button type="submit" className="w-full mt-2" disabled={processing}>
                            {processing ? "Memproses..." : "Bayar Sekarang"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Dialog Konfirmasi Pembayaran */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
                        <DialogDescription>Pastikan detail pembayaran sudah benar sebelum melanjutkan.</DialogDescription>
                    </DialogHeader>
                    <div className="rounded-md border p-4 bg-muted/50 my-4 space-y-2">
                        <div className="font-semibold">Metode: <span className="font-normal">{data.payment_method?.toUpperCase() || '-'}</span></div>
                        {layananRincian.length > 0 && (
                            <div>
                                <div className="font-medium">Jenis Pelayanan:</div>
                                <ul className="ml-2">
                                    {layananRincian.map((l, idx) => (
                                        <li key={idx}>{l.label} - Rp {l.price.toLocaleString("id-ID")}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {obatRincian && (
                            <div>
                                <div className="font-medium">Obat:</div>
                                <ul className="ml-2">
                                    <li>{obatRincian.name} x {obatRincian.qty} - Rp {obatRincian.price.toLocaleString("id-ID")} = Rp {obatRincian.subtotal.toLocaleString("id-ID")}</li>
                                </ul>
                            </div>
                        )}
                        {selectedProducts.length > 0 && (
                            <div>
                                <div className="font-medium">Produk:</div>
                                <ul className="ml-2">
                                    {selectedProducts.map((prod, idx) => {
                                        const p = products.find(pr => pr.id === prod.product_id);
                                        return p ? (
                                            <li key={prod.product_id}>{p.name} x {prod.quantity} - Rp {p.price.toLocaleString("id-ID")} = Rp {(p.price * prod.quantity).toLocaleString("id-ID")}</li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>
                        )}
                        <div className="font-bold text-lg mt-2">Total: Rp {grandTotal.toLocaleString("id-ID")}</div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirm(false)} type="button">Batal</Button>
                        <Button onClick={handleConfirmPayment} disabled={processing} type="button">
                            {processing ? "Memproses..." : "Konfirmasi & Bayar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
