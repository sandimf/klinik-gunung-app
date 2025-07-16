import React, { useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useTheme } from '@/Components/theme-provider';

function getFlashKey(flash) {
    return [
        flash.success,
        flash.message,
        flash.error,
        flash.warning,
        flash.info,
        flash._ts
    ].filter(Boolean).join('|');
}

export const FlashToast = () => {
    const { flash } = usePage().props;
    const prevKey = useRef('');
    const { theme } = useTheme();

    useEffect(() => {
        const key = getFlashKey(flash);
        if (key && key !== prevKey.current) {
            if (flash.success) {
                toast.success(flash.success, {
                    // icon: <CircleCheck className="w-5 h-5 text-green-500" />, duration: 4000,
                });
            }
            if (flash.message) {
                toast.success(flash.message, {
                    // icon: <CircleCheck className="w-5 h-5 text-green-500" />, duration: 4000,
                });
            }
            if (flash.error) {
                toast.error(flash.error, {
                    // icon: <X className="h-5 w-5 text-red-500" />, duration: 5000,
                });
            }
            if (flash.warning) {
                toast.warning(flash.warning, {
                    // icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, duration: 4000,
                });
            }
            if (flash.info) {
                toast.info(flash.info, {
                    // icon: <Info className="h-5 w-5 text-blue-500" />, duration: 4000,
                });
            }
            prevKey.current = key;
        }
    }, [flash.success, flash.message, flash.error, flash.warning, flash.info, flash._ts]);

    return (
        <Toaster 
            position="top-center" 
            expand={false}
            visibleToasts={3}
            theme={theme === 'dark' ? 'dark' : 'light'}
            toastOptions={{
                className: 'toast-class',
                descriptionClassName: 'toast-description',
            }}
        />
    );
};
