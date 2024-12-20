import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import PropTypes from "prop-types"; // Untuk validasi props

const MedicalHeader = ({
    title = "Appointment List",
    buttonText = "Buat Appointments",
    setIsCreateModalOpen, // Terima fungsi sebagai prop
    children,
}) => {
    return (
        <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap">
            {/* Judul */}
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            
            {/* Tombol aksi */}
            <div className="flex gap-2">
                {setIsCreateModalOpen && (
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="space-x-1"
                    >
                        <span>{buttonText}</span>
                    </Button>
                )}
            </div>

            {/* Konten custom (optional) */}
            {children && <div className="custom-content">{children}</div>}
        </div>
    );
};

export default MedicalHeader;
