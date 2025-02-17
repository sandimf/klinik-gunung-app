import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';

const MedicalHeader = ({
    title = 'Screening Detail',
    routeName,
    children
}) => {
    return (
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            {/* Menyediakan children untuk custom elemen */}
            {children && <div className="custom-content">{children}</div>}
        </div>
    );
};

export default MedicalHeader;
