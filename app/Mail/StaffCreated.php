<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StaffCreated extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;

    protected $plainPassword;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $plainPassword)
    {
        $this->user = $user;
        $this->plainPassword = $plainPassword;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Your Account Details')
            ->view('mail.staff_created') // File view untuk email
            ->with([
                'name' => $this->user->name,
                'email' => $this->user->email,
                'password' => $this->plainPassword,
            ]);
    }
}
