<?php

namespace App\Jobs;

use App\Mail\StaffCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendStaffCredentialsEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    protected $plainPassword;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $plainPassword)
    {
        $this->user = $user;
        $this->plainPassword = $plainPassword;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Kirim email menggunakan Mail facade
        Mail::to($this->user->email)->send(new StaffCreated($this->user, $this->plainPassword));
    }
}
