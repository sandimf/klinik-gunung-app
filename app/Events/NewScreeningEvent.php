<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Users\Patients;

class NewScreeningEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $patient;
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Patients $patient)
    {
        $this->patient = $patient;
        $this->message = "Screening baru dari pasien: {$patient->name}";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('paramedic-notifications'),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->patient->id,
            'patient_name' => $this->patient->name,
            'patient_id' => $this->patient->id,
            'queue_number' => $this->patient->queue,
            'created_at' => $this->patient->created_at->format('Y-m-d H:i:s'),
            'message' => $this->message,
            'notification_type' => 'new_screening',
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'new-screening';
    }
} 