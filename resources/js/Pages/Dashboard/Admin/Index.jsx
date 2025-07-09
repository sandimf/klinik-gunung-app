import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";

export default function AdminDashboard() {
    const { auth } = usePage().props;
    const user = auth.user;


    return (
        <AdminSidebar header={'Dashboard'}>
            <Head title='Admin Dashboard' />
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Selamat Datang Kembali, {user.name}! 👋</h2>
                </div>
        </AdminSidebar>
    );
}
