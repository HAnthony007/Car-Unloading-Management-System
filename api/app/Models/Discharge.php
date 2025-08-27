<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discharge extends Model
{
    use HasFactory;
    protected $primaryKey = 'discharge_id';

    protected $guarded = ['discharge_id'];

    protected $casts = [
        'discharge_date' => 'datetime',
    ];

    public function portCall(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PortCall::class, 'port_call_id');
    }

    public function vehicles(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        // A discharge can have many vehicles unloaded under it
        return $this->hasMany(Vehicle::class, 'discharge_id');
    }
}
