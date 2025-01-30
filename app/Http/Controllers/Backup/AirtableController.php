<?php

namespace App\Http\Controllers\Backup;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class AirtableController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Admin/Airtable/Index');
    }
}
