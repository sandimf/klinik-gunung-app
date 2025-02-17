import React from 'react';
import { usePage,Head } from '@inertiajs/react';
import WarehouseSidebar from "@/Layouts/Dashboard/WarehouseSidebarLayout";

export default function Warehouse() {
    const user = usePage().props.auth.user;

    return (
        <WarehouseSidebar header={'Dashboard'}>
            <Head title='Dashboard Warehouse' />
        <div>
            <h1>Welcome {user.name}</h1>
        </div>
        </WarehouseSidebar>
    );
}
