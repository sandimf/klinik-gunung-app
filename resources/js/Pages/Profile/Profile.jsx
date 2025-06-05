import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import UpdateProfileInformationForm from "./_components/UpdateProfileInformationForm";
import UpdatePasswordForm from "./_components/UpdatePasswordForm";
import { toast, Toaster } from "sonner";

export default function Profile({ mustVerifyEmail, status }) {
    return (
        <div className="container py-8 mx-auto">
            <Toaster position="top-center" />
            <Head title="Profile" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Perbarui Kata Sandi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UpdatePasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
