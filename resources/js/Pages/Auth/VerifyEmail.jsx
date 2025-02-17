import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import AuthLayout from "@/Layouts/Auth/AuthLayout"
import { Head, Link, useForm, usePage } from "@inertiajs/react"

export default function VerifyEmail({ status }) {
  const { post, processing } = useForm({})
  const { route } = usePage() // Added this line to access the route function

  const submit = (e) => {
    e.preventDefault()

    post(route("verification.send"))
  }

  return (
    <AuthLayout>
      <Head title="Email Verification" />

      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-gray-600">
            Thanks for signing up! Before getting started, could you verify your email address by clicking on the link
            we just emailed to you? If you didn't receive the email, we will gladly send you another.
          </div>

          {status === "verification-link-sent" && (
            <div className="mb-4 text-sm font-medium text-green-600">
              A new verification link has been sent to the email address you provided during registration.
            </div>
          )}

          <form onSubmit={submit}>
            <CardFooter className="flex items-center justify-between p-0">
              <Button type="submit" disabled={processing}>
                Resend Verification Email
              </Button>

              <Link
                href={route("logout")}
                method="post"
                as="button"
                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Log Out
              </Link>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

