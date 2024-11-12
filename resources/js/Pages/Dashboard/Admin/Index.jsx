import React from 'react';
import { usePage,Head } from '@inertiajs/react';
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";

export default function Index() {
    const user = usePage().props.auth.user;

    return (
        <AdminSidebar header={'Dashboard'}>
            <Head title='Admin Dashboard' />
        <div>
            <h1>Welcome to my app {user.name}</h1>
        </div>
        </AdminSidebar>
    );
}
