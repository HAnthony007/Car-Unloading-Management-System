import { useMemo, useState } from 'react';
import { mockVehicles } from '../data/mock-vehicles';
import { Vehicle } from '../types';

export const useVehicles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | Vehicle['status']>('all');
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const q = searchQuery.toLowerCase();
      const matches = v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.chassisNumber.toLowerCase().includes(q);
      if (filter === 'all') return matches;
      return matches && v.status === filter;
    });
  }, [vehicles, searchQuery, filter]);

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  // placeholder for add/edit
  const addVehicle = (data: Omit<Vehicle, 'id'>) => {
    const id = (Date.now() + Math.random()).toString();
    setVehicles(prev => [{ id, ...data }, ...prev]);
  };

  return {
    vehicles,
    filteredVehicles,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    deleteVehicle,
    addVehicle,
  };
};
