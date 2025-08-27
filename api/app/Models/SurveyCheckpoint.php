<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyCheckpoint extends Model
{
    protected $primaryKey = 'checkpoint_id';

    protected $fillable = [
        'title', 'comment', 'survey_id',
    ];

    public function survey(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }

    public function photos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Photo::class, 'checkpoint_id');
    }
}
