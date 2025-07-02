import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Head, useForm } from "@inertiajs/react"
import { MoreHorizontal, ShoppingCart, Trash2, Upload } from "lucide-react"
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Button } from "@/Components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Input } from "@/Components/ui/input"
import { Separator } from "@/Components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader } from "@/Components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "sonner"
import useFlashToast from "@/hooks/flash"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { Label } from "@/Components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/Components/ui/dialog"

export default function MedicalRecord({ products }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentProof, setPaymentProof] = useState(null)
  const { data, setData, post, processing, errors, reset } = useForm({
    items: [],
    payment_method: "cash",
    payment_proof: null,
    total_amount: 0,
  })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [checkoutEvent, setCheckoutEvent] = useState(null)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value)
  }

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1, type: "product" }]
      }
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }, [])

  const totalCost = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)
  }, [cart])

  useEffect(() => {
    const itemsToSend = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number.parseFloat(item.price),
      name: item.name,
    }))
    setData((prevData) => ({
      ...prevData,
      items: itemsToSend,
      total_amount: totalCost,
    }))
  }, [cart, setData, totalCost])

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value)
    setData("payment_method", value)
  }

  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0]
    setPaymentProof(file)
    setData("payment_proof", file)
  }

  const handleCheckout = (e) => {
    if (e) e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Keranjang belanja kosong!",
        variant: "destructive",
      })
      return
    }

    if ((paymentMethod === "qris" || paymentMethod === "transfer") && !paymentProof) {
      toast({
        title: "Error",
        description: "Harap unggah bukti pembayaran untuk metode QRIS atau transfer.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("items", JSON.stringify(data.items))
    formData.append("payment_method", data.payment_method)
    formData.append("total_amount", data.total_amount)
    if (data.payment_proof) {
      formData.append("payment_proof", data.payment_proof)
    }

    post(route("product.checkout"), formData, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setCart([])
        setPaymentMethod("cash")
        setPaymentProof(null)
        reset("items", "payment_method", "payment_proof", "total_amount")
        toast({
          title: "Success",
          description: "Checkout berhasil!",
        })
      },
      onError: (errors) => {
        console.error("Checkout error:", errors)
        toast({
          title: "Error",
          description: errors.items || "Terjadi kesalahan saat checkout. Silakan coba lagi.",
          variant: "destructive",
        })
      },
    })
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [products, searchTerm])

  useFlashToast()

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        if (message) {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          })
        }
      })
    }
  }, [errors])

  useEffect(() => {
    if (
      (paymentMethod === "qris" || paymentMethod === "transfer") &&
      !paymentProof
    ) {
      toast({
        title: "Perhatian",
        description: "Harap unggah bukti pembayaran untuk metode QRIS atau transfer.",
        variant: "destructive",
      })
    }
  }, [paymentMethod])

  return (
    <CashierSidebar>
      <Head title="Product" />
      <Toaster position="top-center" />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Pembelian Barang</h1>
        <div className="flex items-center justify-between">
          <Input
            placeholder="Cari berdasarkan nama..."
            className="max-w-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${product.name}`}
                        alt={product.name}
                      />
                      <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit product</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete product</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{product.name}</div>
                    <p className="text-xs text-muted-foreground">Kategori Barang</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{formatCurrency(Number.parseFloat(product.price))}</p>
                      <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Beli
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Keranjang Belanja</h2>
              {cart.length === 0 ? (
                <p className="text-muted-foreground">Keranjang kosong.</p>
              ) : (
                <div>
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatCurrency(Number.parseFloat(item.price))}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <p className="text-lg font-bold">Total: {formatCurrency(totalCost)}</p>
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Metode Pembayaran</h3>
                      <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash">Tunai</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="qris" id="qris" />
                          <Label htmlFor="qris">QRIS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="transfer" id="transfer" />
                          <Label htmlFor="transfer">Transfer Bank</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {(paymentMethod === "qris" || paymentMethod === "transfer") && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Bukti Pembayaran</h3>
                        <Input type="file" onChange={handlePaymentProofUpload} accept="image/*" className="mb-2" />
                        {paymentProof && <p className="text-sm text-green-600">File terunggah: {paymentProof.name}</p>}
                      </div>
                    )}
                    <Button
                      size="lg"
                      className="mt-4 w-full"
                      onClick={(e) => {
                        setCheckoutEvent(e);
                        setConfirmOpen(true);
                      }}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Checkout"}
                    </Button>
                    {errors.items && <p className="text-red-500 mt-2">{errors.items}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Checkout</DialogTitle>
          </DialogHeader>
          <div>Apakah Anda yakin ingin melakukan checkout?</div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={processing}
            >
              Batal
            </Button>
            <Button
              onClick={(e) => {
                setConfirmOpen(false);
                handleCheckout(checkoutEvent || e);
              }}
              disabled={processing}
            >
              Yakin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CashierSidebar>
  )
}

