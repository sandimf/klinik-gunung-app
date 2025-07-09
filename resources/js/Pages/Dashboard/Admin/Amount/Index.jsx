import React, { useState } from "react"
import { Head, useForm, router } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import Sidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/Components/ui/command"
import { Trash2, Edit, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"
import { Label } from "@/Components/ui/label"

const TYPE_OPTIONS = [
  { value: "Screening", label: "Screening" },
  { value: "Pendamping Dokter", label: "Pendamping Dokter" },
  { value: "Pendamping Paramedis", label: "Pendamping Paramedis" },
  { value: "konsultasi", label: "Konsultasi" },
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

  // Tambah harga baru
  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("amounts.store"), {
      onSuccess: () => {
        toast.success("Harga berhasil ditambahkan.")
        reset()
        setDisplayAmount("")
      },
      onError: () => {
        toast.error("Gagal menambah harga.")
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

  // Combobox logic (shadcn/ui)
  const handleTypeInputChange = (value) => {
    setData("type", value)
  }

  const handleTypeSelect = (value) => {
    setData("type", value)
    setOpen(false)
    setTimeout(() => {
      document.getElementById("amount-input")?.focus()
    }, 100)
  }

  const filteredOptions = TYPE_OPTIONS.filter(opt =>
    opt.label.toLowerCase().includes((data.type || "").toLowerCase())
  )

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

  return (
    <Sidebar header={'Harga Screening'}>
      <Head title="Atur Harga Screening" />
      <Card>
        <CardHeader>
          <CardTitle>Atur Harga Screening</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-6">
            <div className="flex flex-col md:w-1/2">
              <Label htmlFor="type-input" className="mb-1">Tipe Harga</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Input
                    id="type-input"
                    className="cursor-pointer placeholder:text-gray-400"
                    placeholder="Tipe harga (pilih atau ketik manual)"
                    value={data.type}
                    onChange={e => {
                      handleTypeInputChange(e.target.value)
                      setOpen(true)
                    }}
                    onFocus={() => setOpen(true)}
                    autoComplete="off"
                  />
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[200px]">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Cari atau ketik tipe..."
                      value={data.type}
                      onValueChange={handleTypeInputChange}
                      autoFocus={false}
                    />
                    <CommandList>
                      {data.type === "" && (
                        <CommandItem disabled className="text-muted-foreground">
                          Pilih atau ketik tipe harga...
                        </CommandItem>
                      )}
                      {filteredOptions.length === 0 && data.type !== "" && (
                        <CommandEmpty>Tidak ada pilihan</CommandEmpty>
                      )}
                      {filteredOptions.map(opt => (
                        <CommandItem
                          key={opt.value}
                          value={opt.value}
                          onSelect={handleTypeSelect}
                          className="cursor-pointer"
                        >
                          {opt.label}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.type && (
                <p className="text-xs text-red-500 mt-1">{errors.type}</p>
              )}
            </div>
            <div className="flex flex-col md:w-1/3">
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
            <div className="flex flex-col md:justify-end md:self-end w-full md:w-auto">
              <Button
                type="submit"
                disabled={processing}
                className="h-10 w-full md:w-auto"
                id="submit-btn"
              >
                <Plus/>
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
                          <Edit/>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} type="button">
                          <Trash2 />
                        </Button>
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
