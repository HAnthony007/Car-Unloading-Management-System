<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyTemplateCheckpoint extends Model
{
    use HasFactory;

    protected $primaryKey = 'survey_template_checkpoint_id';

    protected $fillable = [
        'survey_template_id', 'title_checkpoint', 'description_checkpoint', 'default_result_checkpoint', 'order_checkpoint', 'active',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(SurveyTemplate::class, 'survey_template_id');
    }
}
