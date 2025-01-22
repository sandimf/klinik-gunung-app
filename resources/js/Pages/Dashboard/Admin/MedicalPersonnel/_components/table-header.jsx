import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';
import { Plus } from "lucide-react"

const MedicalHeader = ({
    title = 'Daftar Staff Klinik Gunung',
    buttonText = 'Tambah Staff',
    routeName,
    children
}) => {
    return (
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            <div className='flex gap-2'>
                    <Link href={routeName}>
                        <Button className='space-x-1'>
                            <Plus/>
                            <span>{buttonText}</span>
                        </Button>
                    </Link>
            </div>

            {/* Menyediakan children untuk custom elemen */}
            {children && <div className="custom-content">{children}</div>}
        </div>
    );
};

export default MedicalHeader;
