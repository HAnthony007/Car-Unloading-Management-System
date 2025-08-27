<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortCall extends Model
{
    protected $primaryKey = 'port_call_id';

    protected $guarded = ['port_call_id'];

    public function vessel(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Vessel::class, 'vessel_id');
    }

    public function dock(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Dock::class, 'dock_id');
    }

    public function discharges(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Discharge::class, 'port_call_id');
    }

    public function followUpFiles(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(FollowUpFile::class, 'port_call_id');
    }
}
