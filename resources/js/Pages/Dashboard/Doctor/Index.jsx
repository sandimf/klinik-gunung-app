import React from 'react';
import { usePage,Head } from '@inertiajs/react';
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";

export default function Index() {
    const user = usePage().props.auth.user;
    return (
        <DoctorSidebar header={'Dashboard'}>

        <div>
            <h1>Welcome to my app {user.name}</h1>
        </div>
        </DoctorSidebar>
    );
}
