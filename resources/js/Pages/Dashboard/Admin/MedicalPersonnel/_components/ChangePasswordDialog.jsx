import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { useState } from "react"
import { router } from "@inertiajs/react"

export default function ChangePasswordDialog({ open, onOpenChange, userId }) {
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    router.patch(
      route("staff.updatePassword", userId),
      {
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onSuccess: () => {
          setPassword("")
          setPasswordConfirmation("")
          onOpenChange(false)
        },
        onError: (errors) => {
          setError(errors.password)
        },
        onFinish: () => setLoading(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Ubah Password</DialogTitle>
        <DialogDescription>
          Masukkan password baru untuk staf ini.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Konfirmasi password"
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 