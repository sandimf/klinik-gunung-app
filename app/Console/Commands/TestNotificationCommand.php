<?php

namespace App\Console\Commands;

use App\Events\NewScreeningEvent;
use App\Models\Notifications\Notification;
use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
use Illuminate\Console\Command;

class TestNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:notification {--count=1 : Number of test notifications to create}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test notifications for paramedics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = (int) $this->option('count');

        $this->info("Creating {$count} test notification(s)...");

        // Get all paramedics
        $paramedics = Paramedis::all();

        if ($paramedics->isEmpty()) {
            $this->error('No paramedics found in the system!');

            return 1;
        }

        // Get or create a test patient
        $patient = Patients::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'user_id' => 1,
                'nik' => '1234567890123456',
                'name' => 'Test Patient',
                'place_of_birth' => 'Jakarta',
                'date_of_birth' => '2000-01-01',
                'rt_rw' => '001/001',
                'address' => 'Jl. Test No. 123',
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
                'tinggi_badan' => 170.00,
                'berat_badan' => 65.00,
                'screening_status' => 'pending',
                'health_status' => 'pending',
                'health_check_status' => 'pending',
                'payment_status' => 'pending',
                'queue' => rand(1, 100),
                'screening_date' => now(),
            ]
        );

        $createdCount = 0;

        foreach ($paramedics as $paramedic) {
            for ($i = 0; $i < $count; $i++) {
                try {
                    // Create notification record
                    Notification::create([
                        'user_id' => $paramedic->user_id,
                        'type' => 'new_screening',
                        'title' => 'Screening Baru (Test)',
                        'message' => "Pasien test: {$patient->name} (Antrian: {$patient->queue})",
                        'data' => [
                            'patient_id' => $patient->id,
                            'patient_name' => $patient->name,
                            'queue_number' => $patient->queue,
                            'screening_date' => $patient->screening_date,
                            'screening_id' => $patient->id,
                            'is_test' => true,
                        ],
                    ]);

                    // Broadcast realtime event
                    broadcast(new NewScreeningEvent($patient))->toOthers();

                    $createdCount++;

                    $this->line("✓ Created notification for paramedic: {$paramedic->name}");

                } catch (\Exception $e) {
                    $this->error("✗ Failed to create notification for paramedic {$paramedic->name}: {$e->getMessage()}");
                }
            }
        }

        $this->info("Successfully created {$createdCount} test notification(s)!");

        return 0;
    }
}
