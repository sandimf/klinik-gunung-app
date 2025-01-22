import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { useForm } from '@inertiajs/react';
import { toast, Toaster } from "sonner";
import { Edit } from 'lucide-react';

const EditMedicineDialog = ({ medicine, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { data, setData, put, processing, errors, reset } = useForm({
    barcode: medicine.barcode,
    medicine_name: medicine.medicine_name,
    brand_name: medicine.brand_name,
    category: medicine.category,
    dosage: medicine.dosage,
    content: medicine.content,
    purchase_price: medicine.pricing.purchase_price,
    otc_price: medicine.pricing.otc_price,
    batch_number: medicine.batches[0]?.batch_number || '',
    quantity: medicine.batches[0]?.quantity || '',
    expiration_date: medicine.batches[0]?.expiration_date || '',
    supplier: medicine.supplier,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmEdit = () => {
    put(route('medicine.update', medicine.id), {
      onSuccess: () => {
        setIsOpen(false);
        setShowConfirmation(false);
        onSuccess();
        reset();
        toast.success('Data obat berhasil diperbarui');
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      setData({
        barcode: medicine.barcode,
        medicine_name: medicine.medicine_name,
        brand_name: medicine.brand_name,
        category: medicine.category,
        dosage: medicine.dosage,
        content: medicine.content,
        purchase_price: medicine.pricing.purchase_price,
        otc_price: medicine.pricing.otc_price,
        batch_number: medicine.batches[0]?.batch_number || '',
        quantity: medicine.batches[0]?.quantity || '',
        expiration_date: medicine.batches[0]?.expiration_date || '',
        supplier: medicine.supplier,
      });
    }
  }, [isOpen]);

  return (
    <>
      <Toaster position='top-center' />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon"><Edit/></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
          <DialogHeader>
          <DialogTitle>Edit Data Obat {medicine.medicine_name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={data.barcode}
                    onChange={(e) => setData('barcode', e.target.value)}
                    placeholder="Masukkan barcode"
                  />
                  {errors.barcode && <p className="text-red-500 text-sm">{errors.barcode}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicine_name">Nama Obat</Label>
                  <Input
                    id="medicine_name"
                    value={data.medicine_name}
                    onChange={(e) => setData('medicine_name', e.target.value)}
                    placeholder="Masukkan nama obat"
                  />
                  {errors.medicine_name && <p className="text-red-500 text-sm">{errors.medicine_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand_name">Nama Merek</Label>
                  <Input
                    id="brand_name"
                    value={data.brand_name}
                    onChange={(e) => setData('brand_name', e.target.value)}
                    placeholder="Masukkan nama merek"
                  />
                  {errors.brand_name && <p className="text-red-500 text-sm">{errors.brand_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    placeholder="Masukkan kategori obat"
                  />
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosis</Label>
                  <Input
                    id="dosage"
                    type="number"
                    value={data.dosage}
                    onChange={(e) => setData("dosage", parseFloat(e.target.value))}
                    placeholder="Masukkan dosis obat"
                  />
                  {errors.dosage && <p className="text-red-500 text-sm">{errors.dosage}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Kandungan</Label>
                  <Input
                    id="content"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder="Masukkan kandungan obat"
                  />
                  {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Harga Beli</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    value={data.purchase_price}
                    onChange={(e) => setData('purchase_price', e.target.value)}
                    placeholder="Masukkan harga beli"
                  />
                  {errors.purchase_price && <p className="text-red-500 text-sm">{errors.purchase_price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otc_price">Harga Jual</Label>
                  <Input
                    id="otc_price"
                    type="number"
                    value={data.otc_price}
                    onChange={(e) => setData('otc_price', e.target.value)}
                    placeholder="Masukkan harga jual"
                  />
                  {errors.otc_price && <p className="text-red-500 text-sm">{errors.otc_price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch_number">Nomor Batch</Label>
                  <Input
                    id="batch_number"
                    value={data.batch_number}
                    onChange={(e) => setData('batch_number', e.target.value)}
                    placeholder="Masukkan nomor batch"
                  />
                  {errors.batch_number && <p className="text-red-500 text-sm">{errors.batch_number}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Jumlah</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={data.quantity}
                    onChange={(e) => setData('quantity', e.target.value)}
                    placeholder="Masukkan jumlah stok"
                  />
                  {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiration_date">Tanggal Kadaluarsa</Label>
                  <Input
                    id="expiration_date"
                    type="date"
                    value={data.expiration_date}
                    onChange={(e) => setData('expiration_date', e.target.value)}
                  />
                  {errors.expiration_date && <p className="text-red-500 text-sm">{errors.expiration_date}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={data.supplier}
                    onChange={(e) => setData('supplier', e.target.value)}
                    placeholder="Masukkan nama supplier (opsional)"
                  />
                  {errors.supplier && <p className="text-red-500 text-sm">{errors.supplier}</p>}
                </div>
              </div>
              <Button type="submit" disabled={processing} className="w-full">
                {processing ? 'Memperbaharui...' : 'Perbaharui Obat'}
              </Button>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Perubahan</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin mengubah data obat ini?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Batal
            </Button>
            <Button onClick={confirmEdit} disabled={processing}>
              {processing ? 'Memperbaharui...' : 'Ya, Perbaharui Obat'}
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
        </>
  );
};

export default EditMedicineDialog;
