<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discharge extends Model
{
    protected $primaryKey = 'discharge_id';

    public function portCall(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PortCall::class, 'port_call_id');
    }

    public function vehicle(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }
}
