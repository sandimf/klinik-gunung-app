// MedicineHeader.js
import AddProductButton from "./create-product"; // Impor tombol

const ProductHeader = ({
    title = 'Daftar Produk',
    onAddProductClick,  // Event handler untuk membuka dialog
    children
}) => {
    return (
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            <div className='flex gap-2'>
                {/* Tombol dengan event custom */}
                <AddProductButton onClick={onAddProductClick} />
            </div>

            {/* Menyediakan children untuk custom elemen */}
            {children && <div className="custom-content">{children}</div>}
        </div>
    );
};

export default ProductHeader;
