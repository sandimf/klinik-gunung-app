import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import UpdateProfileInformationForm from './_components/UpdateProfileInformationForm';
import UpdatePasswordForm from './_components/UpdatePasswordForm';
import {toast,Toaster} from "sonner"
import WarehouseSidebar from '@/Layouts/Dashboard/WarehouseSidebarLayout';
export default function Edit({ mustVerifyEmail, status }) {

    return (
        <WarehouseSidebar header={'Profile'}>
        <div className="container mx-auto py-8">
            <Toaster position='top-center'/>
            <Head title="Profile" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
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
                        <CardTitle>Update Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UpdatePasswordForm />
                    </CardContent>
                </Card>

            </div>
        </div>
        </WarehouseSidebar>
    );
}
