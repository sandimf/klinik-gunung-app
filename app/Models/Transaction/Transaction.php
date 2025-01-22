<?php

namespace App\Models\Transaction;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'no_transaction',
        'total_price',
        'payment_method',
        'payment_proof',
        'items_details',
    ];

    protected $casts = [
        'items_details' => 'array', // Mengonversi items_details menjadi array
    ];

    protected static function boot()
    {
        parent::boot();

        // Automatically generate UUID and transaction number
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }

            // Generate unique transaction number
            if (empty($model->no_transaction)) {
                $model->no_transaction = self::generateUniqueTransactionNumber();
            }
        });
    }

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
}