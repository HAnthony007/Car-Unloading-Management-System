<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyCheckpoint extends Model
{
    use HasFactory;

    protected $primaryKey = 'checkpoint_id';

    protected $fillable = [
        'title_checkpoint', 'comment_checkpoint', 'description_checkpoint', 'result_checkpoint', 'order_checkpoint', 'survey_id',
        // extended column
        'photos',
    ];

    protected $casts = [
        'photos' => 'array',
    ];

    // Virtual attribute: status maps to result_checkpoint
    public function getStatusAttribute(): ?string
    {
        return $this->attributes['result_checkpoint'] ?? null;
    }

    public function setStatusAttribute(?string $value): void
    {
        $this->attributes['result_checkpoint'] = $value;
    }

    // Virtual attribute: comment maps to comment_checkpoint
    public function getCommentAttribute(): ?string
    {
        return $this->attributes['comment_checkpoint'] ?? null;
    }

    public function setCommentAttribute(?string $value): void
    {
        $this->attributes['comment_checkpoint'] = $value;
    }

    public function survey(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }

    public function photos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Photo::class, 'checkpoint_id');
    }
}
