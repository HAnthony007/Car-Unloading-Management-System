<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $primaryKey = 'document_id';

    protected $fillable = [
        'document_path',
        'document_description',
        'type',
        'uploaded_at',
        'port_call_id',
        'follow_up_file_id',
        'vehicle_id',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function followUpFile(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(FollowUpFile::class, 'follow_up_file_id');
    }

    public function portCall(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PortCall::class, 'port_call_id');
    }

    public function vehicle(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }
}
