<?php

namespace Database\Factories\Providers;

use Faker\Provider\Base;

class MalagasyPersonProvider extends Base
{
    /**
     * Return a Malagasy-style full name.
     */
    public function malagasyFullName(): string
    {
        $firstNames = [
            'Rakoto', 'Rabe', 'Rasoa', 'Mamy', 'Hery', 'Fetra', 'Toky', 'Vero', 'Lanto', 'Tahina',
            'Nirina', 'Faly', 'Soa', 'Tojo', 'Aina', 'Faniry', 'Voahangy', 'Harena', 'Tiana', 'Sarobidy',
        ];

        $lastNames = [
            'Rakotondrabe', 'Randriamiharisoa', 'Rakotomalala', 'Rasolofoniaina', 'Ravelomanana',
            'Andrianarisoa', 'Rasamimanana', 'Andrianarivelo', 'Ratsimbazafy', 'Raharinivo',
        ];

        return sprintf('%s %s', static::randomElement($firstNames), static::randomElement($lastNames));
    }

    /**
     * Return a Malagasy mobile phone number (10 digits), e.g. 0341234567.
     */
    public function malagasyPhone(): string
    {
        $prefix = static::randomElement(['032', '033', '034']);

        return $prefix.$this->generator->numerify('#######');
    }
}
