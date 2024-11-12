import React from 'react';
import { usePage,Head } from '@inertiajs/react';
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";

export default function Index() {
    const user = usePage().props.auth.user;

    return (
        <CashierSidebar header={'Dashboard'}>
            <Head title='Dashboard'/>
        <div>
            <h1>Welcome to my app {user.name}</h1>
        </div>
        </CashierSidebar>
    );
}
