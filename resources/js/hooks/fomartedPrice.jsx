import { useState, useCallback } from "react"

// Fungsi formatPrice di luar hook untuk mengurangi rekreasi fungsi
function formatPrice(value) {
  // Pastikan input adalah string
  const numericString = String(value).replace(/\D/g, "")
  // Ubah menjadi angka dan format
  const number = Number.parseInt(numericString, 10)
  if (isNaN(number)) return ""
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

export function useFormattedPrice(initialValue = "") {
  const [formattedValue, setFormattedValue] = useState(formatPrice(initialValue))
  const [numericValue, setNumericValue] = useState(
    String(initialValue).replace(/\D/g, "")
  )

  const handlePriceChange = useCallback(
    (value) => {
      const numericString = String(value).replace(/\D/g, "")
      setNumericValue(numericString)
      setFormattedValue(formatPrice(numericString))
    },
    [] // Tidak ada dependensi karena formatPrice sudah di luar
  )

  return {
    formattedValue,
    numericValue,
    handlePriceChange,
  }
}
