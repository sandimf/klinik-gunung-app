<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Masker Medis',
                'price' => 15000,
                'stock' => 100,
            ],
            [
                'name' => 'Hand Sanitizer 100ml',
                'price' => 25000,
                'stock' => 50,
            ],
            [
                'name' => 'Susu Nutrisi',
                'price' => 40000,
                'stock' => 30,
            ],
            [
                'name' => 'Vitamin C 500mg',
                'price' => 18000,
                'stock' => 80,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
} 