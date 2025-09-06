<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $primaryKey = 'vehicle_id';

    // Allow mass assignment for all attributes except the primary key (align with other models)
    protected $guarded = ['vehicle_id'];

    // A vehicle has many discharges (one per unloading event)
    public function discharges(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Discharge::class, 'vehicle_id');
    }

    // A vehicle has one follow-up file (current design couples file to vehicle)
    public function followUpFile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(FollowUpFile::class, 'vehicle_id');
    }

    public function movements(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Movement::class, 'vehicle_id');
    }

    // photos() relation removed (Photo no longer references vehicle_id)
}
