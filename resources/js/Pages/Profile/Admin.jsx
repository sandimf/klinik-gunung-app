import AdminSidebar from '@/Layouts/Dashboard/AdminSidebarLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminSidebar header={'Profile Edit'}>
            <Head title="Profile" />
            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    className="max-w-xl"
                />
            </div>

            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                <UpdatePasswordForm className="max-w-xl" />
            </div>

            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                <DeleteUserForm className="max-w-xl" />
            </div>
        </AdminSidebar>
    );
}
