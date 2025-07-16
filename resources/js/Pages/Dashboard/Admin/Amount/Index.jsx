import React, { useState } from "react"
import { Head, useForm, router } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import Sidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/Components/ui/command"
import { Trash2, Edit, Plus, ChevronDown, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"
import { Label } from "@/Components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const TYPE_OPTIONS = [
  { value: "Screening", label: "Screening" },
  { value: "Pendampingan Perawat", label: "Pendampingan Perawat" },
  { value: "Pendampingan Paramedis", label: "Pendampingan Paramedis" },
  { value: "Pendampingan Dokter", label: "Pendampingan Dokter" },
  { value: "konsultasi Dokter", label: "Konsultasi Dokter" },
]

// Helper format rupiah
function formatRupiah(value) {
  if (!value) return ""
  const number = typeof value === "string" ? value.replace(/[^\d]/g, "") : value
  return "Rp " + parseInt(number || 0, 10).toLocaleString("id-ID")
}

function parseRupiah(value) {
  return value.replace(/[^\d]/g, "")
}

export default function AmountIndex({ amounts = [] }) {
  const [editId, setEditId] = useState(null)
  const [editAmount, setEditAmount] = useState(0)
  const [displayAmount, setDisplayAmount] = useState("")
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { data, setData, post, processing, reset, errors } = useForm({
    type: "",
    amount: "",
  })
  const [typeSearch, setTypeSearch] = useState("");

  // Tambah harga baru
  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("amounts.store"), {
      onSuccess: () => {
        reset()
        setDisplayAmount("")
      },
      onError: () => {
      },
    })
  }

  // Edit harga
  const handleEdit = (id, amount) => {
    setEditId(id)
    setEditAmount(amount)
  }

  const handleEditSave = (id) => {
    router.post(
      route("amounts.update", id),
      { amount: editAmount, _method: "put" },
      {
        onSuccess: () => {
          toast.success("Harga berhasil diupdate.")
          setEditId(null)
        },
        onError: () => {
          toast.error("Gagal update harga.")
        },
      }
    )
  }

  // Handle input harga dengan format Rp
  const handleAmountChange = (e) => {
    const raw = parseRupiah(e.target.value)
    setDisplayAmount(formatRupiah(raw))
    setData("amount", raw)
  }

  // Hapus harga
  const handleDelete = (id) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    router.delete(route("amounts.destroy", deleteId), {
      onSuccess: () => toast.success("Harga berhasil dihapus."),
      onError: () => toast.error("Gagal menghapus harga."),
      onFinish: () => {
        setDeleteDialogOpen(false)
        setDeleteId(null)
      }
    })
  }

  // Daftar type default dari seeder
  const defaultTypes = [
    "Screening",
    "Pendampingan Perawat",
    "Pendampingan Paramedis",
    "Pendampingan Dokter",
    "Konsultasi Dokter"
  ];

  return (
    <Sidebar header={'Harga Screening'}>
      <Head title="Atur Harga Screening" />
      <Card>
        <CardHeader>
          <CardTitle>Atur Harga Screening</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-2 mb-6">
            <div className="flex flex-col md:w-1/2">
              <div className="grid w-full  items-center gap-3">
                <Label htmlFor="type-input" className="mb-1">Jenis Pelayanan</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {data.type
                        ? TYPE_OPTIONS.find((option) => option.value === data.type)?.label || data.type
                        : "Pilih Jenis Pelayanan.."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <Command>
                      <CommandInput
                        placeholder="Cari Jenis Layanan..."
                        value={typeSearch}
                        onValueChange={setTypeSearch}
                      />
                      <CommandEmpty>
                        Tidak ada Jenis Layanan ditemukan.
                        {typeSearch && (
                          <div
                            className="cursor-pointer text-blue-600 mt-2"
                            onClick={() => {
                              setData("type", typeSearch)
                              setOpen(false)
                              setTypeSearch("")
                            }}
                          >
                            + Tambah Jenis Pelayanan: <b>{typeSearch}</b>
                          </div>
                        )}
                      </CommandEmpty>
                      <CommandList>
                        {TYPE_OPTIONS.filter(option =>
                          option.label.toLowerCase().includes(typeSearch.toLowerCase())
                        ).map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              setData("type", currentValue === data.type ? "" : currentValue)
                              setOpen(false)
                              setTypeSearch("")
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                data.type === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                        {typeSearch &&
                          !TYPE_OPTIONS.some(option => option.label.toLowerCase() === typeSearch.toLowerCase()) && (
                            <CommandItem
                              value={typeSearch}
                              onSelect={() => {
                                setData("type", typeSearch)
                                setOpen(false)
                                setTypeSearch("")
                              }}
                              className="text-blue-600"
                            >
                              + Tambah Jenis Pelayanan: <b>{typeSearch}</b>
                            </CommandItem>
                          )
                        }
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {errors.type && (
                  <p className="text-xs text-red-500 mt-1">{errors.type}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:w-1/3">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="amount-input" className="mb-1">Harga</Label>
                <Input
                  id="amount-input"
                  placeholder="Harga"
                  inputMode="numeric"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  className=""
                />
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={processing}
                className="grid w-full items-center gap-3"
                id="submit-btn"
              >
                <Plus />
              </Button>
            </div>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Tipe</TableHead>
                <TableHead className="w-1/3">Harga</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">Belum ada data</TableCell>
                </TableRow>
              )}
              {amounts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{TYPE_OPTIONS.find(opt => opt.value === item.type)?.label || item.type}</TableCell>
                  <TableCell>
                    {editId === item.id ? (
                      <Input
                        type="number"
                        min="0"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                        className="w-32"
                        autoFocus
                      />
                    ) : (
                      <span>Rp {parseFloat(item.amount).toLocaleString("id-ID")}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === item.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEditSave(item.id)} type="button">Simpan</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditId(null)} type="button">Batal</Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item.id, item.amount)} type="button">
                          <Edit />
                        </Button>
                        {/* Tombol hapus hanya muncul jika bukan data default */}
                        {!defaultTypes.includes(item.type) && (
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} type="button">
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Apakah Anda yakin ingin menghapus harga ini? Tindakan ini tidak dapat dibatalkan.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} type="button">Batal</Button>
            <Button variant="destructive" onClick={confirmDelete} type="button">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}