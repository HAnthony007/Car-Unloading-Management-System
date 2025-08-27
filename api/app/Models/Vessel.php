<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vessel extends Model
{
    protected $primaryKey = 'vessel_id';

    protected $guarded = ['vessel_id'];

    public function portCalls(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PortCall::class, 'vessel_id');
    }
}
