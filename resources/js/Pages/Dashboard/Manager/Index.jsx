import React from 'react';
import { usePage,Head } from '@inertiajs/react';
import ManagerSidebar from "@/Layouts/Dashboard/ManagerSidebarLayout";

export default function Index() {
    const user = usePage().props.auth.user;

    return (
        <ManagerSidebar header={'Dashboard'}>
            <Head title='Dashboard Manager' />
        <div>
        <h1>Selamat Datang di Dashboard Manager, {user.name} 👋</h1>
        </div>
        </ManagerSidebar>
    );
}
