<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parking extends Model
{
    protected $primaryKey = 'parking_id';

    protected $fillable = [
        'parking_name',
        'location',
        'capacity',
        'parking_number',
    ];
}
