<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $primaryKey = 'document_id';

    protected $fillable = [
        'document_path',
        'document_description',
        'type',
        'uploaded_at',
        'follow_up_file_id',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function followUpFile(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(FollowUpFile::class, 'follow_up_file_id');
    }
}
