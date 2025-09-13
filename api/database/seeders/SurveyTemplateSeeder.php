<?php

namespace Database\Seeders;

use App\Models\SurveyTemplate;
use App\Models\SurveyTemplateCheckpoint;
use Illuminate\Database\Seeder;

class SurveyTemplateSeeder extends Seeder
{
    public function run(): void
    {
        if (SurveyTemplate::query()->exists()) {
            return; // avoid duplicate seeding
        }

        $templates = config('inspection.templates', []);
        foreach ($templates as $key => $set) {
            $template = SurveyTemplate::query()->create([
                'template_key' => $key,
                'name' => $set['survey']['survey_name'] ?? ucfirst($key),
                'description' => $set['survey']['survey_description'] ?? null,
                'default_overall_status' => $set['survey']['overall_status'] ?? 'PENDING',
                'active' => true,
                'created_by' => null,
            ]);

            foreach ($set['checkpoints'] as $cp) {
                SurveyTemplateCheckpoint::query()->create([
                    'survey_template_id' => $template->survey_template_id,
                    'title_checkpoint' => $cp['title_checkpoint'],
                    'description_checkpoint' => $cp['description_checkpoint'] ?? null,
                    'default_result_checkpoint' => $cp['result_checkpoint'] ?? null,
                    'order_checkpoint' => $cp['order_checkpoint'] ?? null,
                    'active' => true,
                ]);
            }
        }
    }
}
