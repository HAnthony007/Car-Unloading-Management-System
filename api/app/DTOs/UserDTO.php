<?php

namespace App\DTOs;

use App\Models\User;

class UserDTO
{
    private $id;
    public string $name;
    public string $email;

    public function __construct(User $user)
    {
        $this->id = $user->id;
        $this->name = $user->name;
        $this->email = $user->email;
    }

    public function toArrray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }
}
