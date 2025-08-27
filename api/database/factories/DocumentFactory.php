<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\FollowUpFile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'document_path' => 'docs/'.fake()->uuid().'.pdf',
            'document_description' => fake()->sentence(),
            'type' => fake()->randomElement(['invoice', 'bill_of_lading', 'customs', 'other']),
            'uploaded_at' => fake()->dateTimeBetween('-10 days', 'now'),
            'follow_up_file_id' => FollowUpFile::factory(),
        ];
    }
}
