<?php

namespace App\Models;

use App\Models\Medicines\MedicineBatch;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Payments extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'no_transaction',
        'cashier_id',
        'patient_id',
        'payment_status',
        'amount_paid',
        'payment_method',
        'quantity_product',
        'price_product',
        'payment_proof',
    ];

    protected static function boot()
    {
        parent::boot();

        // Secara otomatis menghasilkan UUID dan nomor transaksi saat data dibuat
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }

            // Generate nomor transaksi
            if (empty($model->no_transaction)) {
                $model->no_transaction = self::generateUniqueTransactionNumber();
            }
        });
    }

    /**
     * Menghasilkan nomor transaksi unik
     */
    protected static function generateUniqueTransactionNumber()
    {
        do {
            // Format nomor transaksi: TRX-YYYYMMDD-XXXX
            $date = now()->format('Ymd');
            $randomNumber = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Gabungkan format nomor transaksi
            $transactionNumber = "TRX-{$date}-{$randomNumber}";
        } while (self::where('no_transaction', $transactionNumber)->exists());

        return $transactionNumber;
    }

    public function cashier()
    {
        return $this->belongsTo(Cashier::class);
    }

    public function medicineBatch()
    {
        return $this->belongsTo(MedicineBatch::class, 'medicine_batch_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patients::class);
    }

    // Metode untuk melakukan pengurangan stok obat
    public function processPurchase()
    {
        if ($this->quantity_product && $this->medicineBatch) {
            $this->medicineBatch->decrement('quantity', $this->quantity_product);
        }
    }
}
