<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;

class CustomPdfController extends Controller
{
    public function index(){
        return view('pdf.screening');
    }
}
