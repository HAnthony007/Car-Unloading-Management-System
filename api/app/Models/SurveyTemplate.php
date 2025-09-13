<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurveyTemplate extends Model
{
    use HasFactory;

    protected $primaryKey = 'survey_template_id';

    protected $fillable = [
        'template_key', 'name', 'description', 'default_overall_status', 'active', 'created_by',
    ];

    public function checkpoints(): HasMany
    {
        return $this->hasMany(SurveyTemplateCheckpoint::class, 'survey_template_id')
            ->orderBy('order_checkpoint');
    }
}
