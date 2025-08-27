<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;
    protected $primaryKey = 'survey_id';

    protected $fillable = [
        'date', 'result', 'user_id', 'follow_up_file_id',
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function followUpFile(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(FollowUpFile::class, 'follow_up_file_id');
    }

    public function checkpoints(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SurveyCheckpoint::class, 'survey_id');
    }
}
