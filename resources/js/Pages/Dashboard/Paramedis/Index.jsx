import React from 'react';
import { usePage,Head } from '@inertiajs/react';
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";

export default function Index() {
    const user = usePage().props.auth.user;

    return (
        <ParamedisSidebar header={'Dashboard Paremdis'}>
            <Head title='Dashboard Paramedis'/>
        <div>
            <h1>Welcome to my app {user.name}</h1>
        </div>
        </ParamedisSidebar>
    );
}
