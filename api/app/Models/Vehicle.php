<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;
    protected $primaryKey = 'vehicle_id';

    public function discharge(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Discharge::class, 'discharge_id');
    }

    // Why is this hasOne?
    public function followUpFiles(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(FollowUpFile::class, 'vehicle_id');
    }

    public function movements(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Movement::class, 'vehicle_id');
    }

    public function photos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Photo::class, 'vehicle_id');
    }
}
