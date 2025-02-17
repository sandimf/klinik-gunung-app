import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner'; // atau toastify, sesuai dengan yang Anda gunakan
import { CircleCheck,  X } from 'lucide-react';

const useFlashToast = () => {
    const { flash } = usePage().props;

    useEffect(() => {
        // Menampilkan pesan sukses
        if (flash.message) {
            toast(flash.message, {
                icon: <CircleCheck className="h-5 w-5 text-green-500" />,
                type: "success", // Tipe success
            });
        }

        // Menampilkan pesan error
        if (flash.error) {
            toast(flash.error, {
                icon: <X className="h-5 w-5 text-red-500" />,
                type: "error", // Tipe error
            });
        }
    }, [flash.message, flash.error]);
};

export default useFlashToast;
