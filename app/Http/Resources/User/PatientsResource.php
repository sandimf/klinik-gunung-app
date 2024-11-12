<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "nik" => $this->nik,
            "name" => $this->name,
            "email" => $this->email,
            "age" => $this->age,
            "gender" => $this->gender,
            "contact" => $this->contact,
            "screening_status" => $this->screening_status,
            "health_status" => $this->health_status,
        ];
    }
}
