import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import AuthLayout from "@/Layouts/Auth/AuthLayout"
import { Head, useForm, usePage } from "@inertiajs/react"

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: "",
  })
  const { route } = usePage() // Added this line to access the route function

  const submit = (e) => {
    e.preventDefault()

    post(route("password.confirm"), {
      onFinish: () => reset("password"),
    })
  }

  return (
    <AuthLayout>
      <Head title="Confirm Password" />

      <Card>
        <CardHeader>
          <CardTitle>Confirm Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            This is a secure area of the application. Please confirm your password before continuing.
          </p>

          <form onSubmit={submit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  className="w-full"
                  autoFocus
                  onChange={(e) => setData("password", e.target.value)}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <CardFooter className="px-0">
                <Button type="submit" disabled={processing}>
                  Confirm
                </Button>
              </CardFooter>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

