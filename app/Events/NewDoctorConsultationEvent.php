<?php

namespace App\Events;

use App\Models\Users\Patients;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NewDoctorConsultationEvent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $patient;

    public function __construct(Patients $patient)
    {
        $this->patient = $patient;
    }

    public function broadcastOn()
    {
        return new Channel('doctor-notifications');
    }

    public function broadcastAs()
    {
        return 'new.consultation';
    }
}
