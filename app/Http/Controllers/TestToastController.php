<?php

namespace App\Http\Controllers;

use App\Traits\HasFlashMessages;

class TestToastController extends Controller
{
    use HasFlashMessages;

    public function testSuccess()
    {
        return $this->flashSuccess('Test success message berhasil!');
    }

    public function testError()
    {
        return $this->flashError('Test error message berhasil!');
    }

    public function testWarning()
    {
        return $this->flashWarning('Test warning message berhasil!');
    }

    public function testInfo()
    {
        return $this->flashInfo('Test info message berhasil!');
    }
}
