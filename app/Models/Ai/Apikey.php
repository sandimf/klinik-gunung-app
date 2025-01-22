<?php

namespace App\Models\Ai;

use Illuminate\Database\Eloquent\Model;

class Apikey extends Model
{
    // Menentukan nama tabel yang digunakan oleh model
    protected $table = 'apikeys';  // Pastikan nama tabel ini sesuai dengan yang ada di database

    // Menentukan kolom mana saja yang dapat diisi secara massal
    protected $fillable = ['api_key'];

    // Jika tabel tidak memiliki kolom 'created_at' dan 'updated_at', matikan fitur timestamps
    public $timestamps = true;  // Jika tidak memerlukan timestamps, set ke false


}
