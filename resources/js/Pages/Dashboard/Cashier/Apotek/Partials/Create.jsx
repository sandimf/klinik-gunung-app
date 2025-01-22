import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useForm } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

const CreateMedicineDialog = ({ isOpen, setIsOpen, onSuccess }) => {
    const { data, setData, post, processing, errors } = useForm({
        barcode: "",
        medicine_name: "",
        brand_name: "",
        category: "",
        dosage: "",
        content: "",
        purchase_price: "",
        otc_price: "",
        batch_number: "",
        quantity: "",
        expiration_date: "",
        supplier: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("medicine.store"), {
            onSuccess: () => {
                setIsOpen(false); // Close the dialog on success
                onSuccess(); // Trigger the onSuccess callback to handle any side effects
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="hidden">Tambah Obat</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[70vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Tambah Obat Baru</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="barcode">Barcode</Label>
                                <Input
                                    id="barcode"
                                    value={data.barcode}
                                    onChange={(e) =>
                                        setData("barcode", e.target.value)
                                    }
                                    placeholder="Masukkan barcode"
                                />
                                {errors.barcode && (
                                    <p className="text-red-500 text-sm">
                                        {errors.barcode}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="medicine_name">Nama Obat</Label>
                                <Input
                                    id="medicine_name"
                                    value={data.medicine_name}
                                    onChange={(e) =>
                                        setData("medicine_name", e.target.value)
                                    }
                                    placeholder="Masukkan nama obat"
                                />
                                {errors.medicine_name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.medicine_name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="brand_name">Nama Merek</Label>
                                <Input
                                    id="brand_name"
                                    value={data.brand_name}
                                    onChange={(e) =>
                                        setData("brand_name", e.target.value)
                                    }
                                    placeholder="Masukkan nama merek"
                                />
                                {errors.brand_name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.brand_name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(value) =>
                                        setData("category", value)
                                    }
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Pilih kategori obat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Obat Bebas">
                                            Obat Bebas
                                        </SelectItem>
                                        <SelectItem value="Obat Bebas Terbatas">
                                            Obat Bebas Terbatas
                                        </SelectItem>
                                        <SelectItem value="Obat Keras">
                                            Obat Keras
                                        </SelectItem>
                                        <SelectItem value="Jamu">
                                            Jamu
                                        </SelectItem>
                                        <SelectItem value="Obat Herbal Terstandar">
                                            Obat Herbal Terstandar
                                        </SelectItem>
                                        <SelectItem value="Fitofarmaka">
                                            Fitofarmaka
                                        </SelectItem>
                                        <SelectItem value="Kosmetika">
                                            Kosmetika
                                        </SelectItem>
                                        <SelectItem value="Lainnya">
                                            Lainnya
                                        </SelectItem>
                                        <SelectItem value="OTC">OTC</SelectItem>
                                        <SelectItem value="Narkotik">
                                            Narkotik
                                        </SelectItem>
                                        <SelectItem value="Psikotropik">
                                            Psikotropik
                                        </SelectItem>
                                        <SelectItem value="OOT">OOT</SelectItem>
                                        <SelectItem value="Paten Keras">
                                            Paten Keras
                                        </SelectItem>
                                        <SelectItem value="Paten Antibiotik">
                                            Paten Antibiotik
                                        </SelectItem>
                                        <SelectItem value="Generik">
                                            Generik
                                        </SelectItem>
                                        <SelectItem value="Prekursor">
                                            Prekursor
                                        </SelectItem>
                                        <SelectItem value="Prekursor Kombinasi">
                                            Prekursor Kombinasi
                                        </SelectItem>
                                        <SelectItem value="Labor">
                                            Labor
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dosage">Dosis</Label>
                                <Input
                                    id="dosage"
                                    type="number"
                                    value={data.dosage}
                                    onChange={(e) =>
                                        setData("dosage", e.target.value)
                                    }
                                    placeholder="Masukkan dosis obat"
                                />
                                {errors.dosage && (
                                    <p className="text-red-500 text-sm">
                                        {errors.dosage}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Kandungan</Label>
                                <Input
                                    id="content"
                                    value={data.content}
                                    onChange={(e) =>
                                        setData("content", e.target.value)
                                    }
                                    placeholder="Masukkan kandungan obat"
                                />
                                {errors.content && (
                                    <p className="text-red-500 text-sm">
                                        {errors.content}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchase_price">
                                    Harga Beli
                                </Label>
                                <Input
                                    id="purchase_price"
                                    type="number"
                                    value={data.purchase_price}
                                    onChange={(e) =>
                                        setData(
                                            "purchase_price",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Masukkan harga beli"
                                />
                                {errors.purchase_price && (
                                    <p className="text-red-500 text-sm">
                                        {errors.purchase_price}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="otc_price">Harga Jual</Label>
                                <Input
                                    id="otc_price"
                                    type="number"
                                    value={data.otc_price}
                                    onChange={(e) =>
                                        setData("otc_price", e.target.value)
                                    }
                                    placeholder="Masukkan harga jual"
                                />
                                {errors.otc_price && (
                                    <p className="text-red-500 text-sm">
                                        {errors.otc_price}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="batch_number">
                                    Nomor Batch
                                </Label>
                                <Input
                                    id="batch_number"
                                    value={data.batch_number}
                                    onChange={(e) =>
                                        setData("batch_number", e.target.value)
                                    }
                                    placeholder="Masukkan nomor batch"
                                />
                                {errors.batch_number && (
                                    <p className="text-red-500 text-sm">
                                        {errors.batch_number}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Jumlah</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) =>
                                        setData("quantity", e.target.value)
                                    }
                                    placeholder="Masukkan jumlah stok"
                                />
                                {errors.quantity && (
                                    <p className="text-red-500 text-sm">
                                        {errors.quantity}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expiration_date">
                                    Tanggal Kadaluarsa
                                </Label>
                                <Input
                                    id="expiration_date"
                                    type="date"
                                    value={data.expiration_date}
                                    onChange={(e) =>
                                        setData(
                                            "expiration_date",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.expiration_date && (
                                    <p className="text-red-500 text-sm">
                                        {errors.expiration_date}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="supplier">Supplier</Label>
                                <Input
                                    id="supplier"
                                    value={data.supplier}
                                    onChange={(e) =>
                                        setData("supplier", e.target.value)
                                    }
                                    placeholder="Masukkan nama supplier (opsional)"
                                />
                                {errors.supplier && (
                                    <p className="text-red-500 text-sm">
                                        {errors.supplier}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? "Menambahkan..." : "Tambah Obat"}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default CreateMedicineDialog;
