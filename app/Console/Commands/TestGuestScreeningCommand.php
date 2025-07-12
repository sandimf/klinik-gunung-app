<?php

namespace App\Console\Commands;

use App\Services\Screening\GuestScreeningSubmissionService;
use Illuminate\Console\Command;

class TestGuestScreeningCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:guest-screening';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test guest screening submission with notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing guest screening submission...');

        // Mock guest screening data
        $guestData = [
            'nik' => '1234567890123456',
            'name' => 'Test Guest Patient',
            'place_of_birth' => 'Jakarta',
            'date_of_birth' => '2000-01-01',
            'rt_rw' => '001/001',
            'address' => 'Jl. Test Guest No. 123',
            'village' => 'Test Village',
            'district' => 'Test District',
            'religion' => 'ISLAM',
            'marital_status' => 'BELUM KAWIN',
            'occupation' => 'PELAJAR',
            'nationality' => 'WNI',
            'gender' => 'laki-laki',
            'age' => 25,
            'blood_type' => 'O',
            'contact' => '081234567890',
            'email' => 'guest.test.' . time() . '@example.com',
            'tinggi_badan' => 170.00,
            'berat_badan' => 65.00,
            'answers' => [
                [
                    'questioner_id' => 1,
                    'answer' => 'Tidak'
                ],
                [
                    'questioner_id' => 2,
                    'answer' => 'Ya'
                ],
                [
                    'questioner_id' => 3,
                    'answer' => 'Tidak'
                ],
                [
                    'questioner_id' => 4,
                    'answer' => 'Ya'
                ],
                [
                    'questioner_id' => 5,
                    'answer' => 'Tidak'
                ],
                [
                    'questioner_id' => 6,
                    'answer' => 'Ya'
                ],
                [
                    'questioner_id' => 7,
                    'answer' => 'Tidak'
                ],
                [
                    'questioner_id' => 8,
                    'answer' => 'Ya'
                ],
            ]
        ];

        try {
            $service = new GuestScreeningSubmissionService();
            $service->handle($guestData, null);

            $this->info('✅ Guest screening submitted successfully!');
            $this->info('Check paramedis dashboard for notifications.');
            
        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
        }
    }
} 