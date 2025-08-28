<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dock extends Model
{
    use HasFactory;

    protected $primaryKey = 'dock_id';

    protected $guarded = ['dock_id'];

    public function portCalls(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PortCall::class, 'dock_id');
    }
}
