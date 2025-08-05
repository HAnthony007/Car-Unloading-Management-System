<?php

namespace App\DTOs;

use App\Models\User;

class UserDTO
{
    private $user_id;
    private $matriculation_no;
    public string $full_name;
    public string $email;
    public string $avatar;
    public string $phone;
    public string $role_id;

    public function __construct(User $user)
    {
        $this->user_id = $user->user_id;
        $this->matriculation_no = $user->matriculation_no;
        $this->full_name = $user->full_name;
        $this->email = $user->email;
        $this->avatar = $user->avatar;
        $this->phone = $user->phone;
        $this->role_id = $user->role_id;
    }

    public function toArrray(): array
    {
        return [
            'user_id' => $this->user_id,
            'matriculation_no' => $this->matriculation_no,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'phone' => $this->phone,
            'role_id' => $this->role_id,
        ];
    }
}
