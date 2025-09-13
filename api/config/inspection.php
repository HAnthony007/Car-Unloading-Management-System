<?php

return [
    'templates' => [
        'externe' => [
            'survey' => [
                'survey_name' => 'Inspection Externe',
                'survey_description' => 'Inspection de la carrosserie et éléments extérieurs',
                'overall_status' => 'PENDING',
            ],
            'checkpoints' => [
                [
                    'title_checkpoint' => 'État carrosserie',
                    'description_checkpoint' => 'Vérification des rayures, bosses et alignements',
                    'order_checkpoint' => 1,
                ],
                [
                    'title_checkpoint' => 'Phares et feux',
                    'description_checkpoint' => 'Fonctionnement et intégrité des optiques',
                    'order_checkpoint' => 2,
                ],
                [
                    'title_checkpoint' => 'Pneumatiques',
                    'description_checkpoint' => 'Usure, pression apparente, anomalies visibles',
                    'order_checkpoint' => 3,
                ],
            ],
        ],
        'documentation' => [
            'survey' => [
                'survey_name' => 'Vérification Documentation',
                'survey_description' => 'Contrôle des papiers et documents du véhicule',
                'overall_status' => 'PENDING',
            ],
            'checkpoints' => [
                [
                    'title_checkpoint' => 'Carte grise',
                    'description_checkpoint' => 'Présence et cohérence des informations',
                    'order_checkpoint' => 1,
                ],
                [
                    'title_checkpoint' => 'Assurance',
                    'description_checkpoint' => 'Validité du document d’assurance',
                    'order_checkpoint' => 2,
                ],
                [
                    'title_checkpoint' => 'Numéro VIN',
                    'description_checkpoint' => 'Concordance entre châssis et documents',
                    'order_checkpoint' => 3,
                ],
                [
                    'title_checkpoint' => 'Certificat de conformité',
                    'description_checkpoint' => 'Présence et validité du COC / conformité UE',
                    'order_checkpoint' => 4,
                ],
                [
                    'title_checkpoint' => 'Autres documents spécifiques',
                    'description_checkpoint' => 'Documents additionnels requis (douane, transit, etc.)',
                    'order_checkpoint' => 5,
                ],
            ],
        ],
    ],
];
