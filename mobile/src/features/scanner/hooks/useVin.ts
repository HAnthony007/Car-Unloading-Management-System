import { useCallback, useState } from 'react';
import { isValidVin } from '../lib/validation';

export function useVin(initial = '') {
  const [vin, setVin] = useState(initial.toUpperCase());
  const [error, setError] = useState<string | null>(null);

  const update = useCallback((value: string) => {
    const upper = value.toUpperCase();
    setVin(upper);
    setError(null);
  }, []);

  const validate = useCallback(() => {
    if (!isValidVin(vin)) {
      setError('VIN invalide (17 caractères, exclut I, O, Q)');
      return false;
    }
    return true;
  }, [vin]);

  return { vin, setVin: update, error, validate, isValid: isValidVin(vin) };
}
