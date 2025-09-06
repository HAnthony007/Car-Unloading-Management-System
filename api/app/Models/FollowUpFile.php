<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FollowUpFile extends Model
{
    use HasFactory;

    protected $primaryKey = 'follow_up_file_id';

    public $timestamps = true;

    protected $guarded = ['follow_up_file_id'];

    public function vehicle(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function portCall(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PortCall::class, 'port_call_id');
    }

    public function documents(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Document::class, 'follow_up_file_id');
    }

    // Photos now relate through discharge/survey; direct relation removed
    // Survey now belongs to discharge; remove previous hasOne
}
