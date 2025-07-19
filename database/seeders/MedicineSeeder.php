<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medicines\Medicine;
use App\Models\Medicines\MedicinePricing;
use App\Models\Medicines\MedicineBatch;
use Carbon\Carbon;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $medicines = [
            [
                'barcode' => 'OBT001',
                'quantity' => 50,
                'medicine_name' => 'Paracetamol',
                'brand_name' => 'Kimia Farma',
                'category' => 'Analgesik',
                'dosage' => 500,
                'content' => 'Paracetamol 500mg',
                'purchase_price' => 5000,
                'otc_price' => 7000,
                'unit_type' => 'satuan',
                'batch_number' => 'BATCH-001',
                'batch_quantity' => 30,
                'expiration_date' => Carbon::now()->addYear()->toDateString(),
                'supplier' => 'PT Kimia Farma',
            ],
            [
                'barcode' => 'OBT002',
                'quantity' => 30,
                'medicine_name' => 'Amoxicillin',
                'brand_name' => 'Hexpharm',
                'category' => 'Antibiotik',
                'dosage' => 500,
                'content' => 'Amoxicillin 500mg',
                'purchase_price' => 8000,
                'otc_price' => 12000,
                'unit_type' => 'satuan',
                'batch_number' => 'BATCH-002',
                'batch_quantity' => 20,
                'expiration_date' => Carbon::now()->addMonths(18)->toDateString(),
                'supplier' => 'PT Hexpharm',
            ],
            [
                'barcode' => 'OBT003',
                'quantity' => 40,
                'medicine_name' => 'Cetirizine',
                'brand_name' => 'Kalbe',
                'category' => 'Antihistamin',
                'dosage' => 10,
                'content' => 'Cetirizine 10mg',
                'purchase_price' => 6000,
                'otc_price' => 9000,
                'unit_type' => 'satuan',
                'batch_number' => 'BATCH-003',
                'batch_quantity' => 25,
                'expiration_date' => Carbon::now()->addMonths(10)->toDateString(),
                'supplier' => 'PT Kalbe Farma',
            ],
            [
                'barcode' => 'OBT004',
                'quantity' => 25,
                'medicine_name' => 'Ibuprofen',
                'brand_name' => 'Kimia Farma',
                'category' => 'Anti Inflamasi',
                'dosage' => 400,
                'content' => 'Ibuprofen 400mg',
                'purchase_price' => 7000,
                'otc_price' => 10000,
                'unit_type' => 'satuan',
                'batch_number' => 'BATCH-004',
                'batch_quantity' => 15,
                'expiration_date' => Carbon::now()->addMonths(8)->toDateString(),
                'supplier' => 'PT Kimia Farma',
            ],
        ];

        foreach ($medicines as $med) {
            $medicine = Medicine::create([
                'barcode' => $med['barcode'],
                'quantity' => $med['quantity'],
                'medicine_name' => $med['medicine_name'],
                'brand_name' => $med['brand_name'],
                'category' => $med['category'],
                'dosage' => $med['dosage'],
                'content' => $med['content'],
            ]);

            MedicinePricing::create([
                'medicine_id' => $medicine->id,
                'purchase_price' => $med['purchase_price'],
                'otc_price' => $med['otc_price'],
                'unit_type' => $med['unit_type'],
            ]);

            MedicineBatch::create([
                'medicine_id' => $medicine->id,
                'batch_number' => $med['batch_number'],
                'quantity' => $med['batch_quantity'],
                'expiration_date' => $med['expiration_date'],
                'supplier' => $med['supplier'],
            ]);
        }
    }
} 