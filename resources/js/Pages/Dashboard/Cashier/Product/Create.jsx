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
const CreateMedicineDialog = ({ isOpen, setIsOpen, onSuccess }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        stock: "",
        price: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("product.store.cashier"), {
            onSuccess: () => {
                setIsOpen(false); 
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="hidden">Tambah Produk</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] h-[40vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Produk</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Masukkan Nama Produk"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData("stock", e.target.value)
                                    }
                                    placeholder="Masukkan Stock"
                                />
                                {errors.stock && (
                                    <p className="text-red-500 text-sm">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Harga</Label>
                                <Input
                                    id="price"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    placeholder="Masukkan Harga"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm">
                                        {errors.price}
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
