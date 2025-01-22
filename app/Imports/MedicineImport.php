<?php

namespace App\Imports;

use App\Models\Medicines\Medicine;
use Illuminate\Support\Collection;
use App\Models\Medicines\MedicineBatch;
use App\Models\Medicines\MedicinePricing;
use Maatwebsite\Excel\Concerns\ToCollection;

class MedicineImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            // Skip header row
            if ($index === 0) {
                continue;
            }

            // 1. Simpan data ke tabel medicines
            $medicine = Medicine::updateOrCreate(
                ['barcode' => $row[0]], // Kondisi untuk menghindari duplikasi
                [
                    'medicine_name' => $row[1],
                    'brand_name'    => $row[2],
                    'category'      => $row[3],
                    'dosage'        => $row[4],
                    'content'       => $row[5],
                    'quantity'      => $row[6],
                ]
            );

            // 2. Simpan data ke tabel medicine_batches
            MedicineBatch::updateOrCreate(
                [
                    'medicine_id'  => $medicine->id,
                    'batch_number' => $row[7],
                ],
                [
                    'quantity'        => $row[8],
                    'expiration_date' => $row[9],
                    'supplier'        => $row[10],
                ]
            );

            // 3. Simpan data ke tabel medicine_pricings
            MedicinePricing::updateOrCreate(
                ['medicine_id' => $medicine->id],
                [
                    'purchase_price' => $row[11],
                    'otc_price'      => $row[12],
                ]
            );
        }
    }
}
