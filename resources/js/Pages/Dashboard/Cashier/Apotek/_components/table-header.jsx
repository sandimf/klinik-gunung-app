// MedicineHeader.js
import AddMedicineButton from "./add-medicine-dialog"; // Impor tombol

const MedicineHeader = ({
    title = 'Daftar Obat',
    onAddMedicineClick,  // Event handler untuk membuka dialog
    children
}) => {
    return (
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            <div className='flex gap-2'>
                {/* Tombol dengan event custom */}
                <AddMedicineButton onClick={onAddMedicineClick} />
            </div>

            {/* Menyediakan children untuk custom elemen */}
            {children && <div className="custom-content">{children}</div>}
        </div>
    );
};

export default MedicineHeader;
