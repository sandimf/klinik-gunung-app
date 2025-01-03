import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import {toast,Toaster} from "sonner"
import ManagerSidebar from '@/Layouts/Dashboard/ManagerSidebarLayout';
export default function Edit({ mustVerifyEmail, status }) {

    return (
        <ManagerSidebar header={'Profile'}>
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
        </ManagerSidebar>
    );
}
