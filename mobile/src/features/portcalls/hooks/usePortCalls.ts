import { useMemo, useState } from 'react';
import { computeStats } from '../lib/format';
import { PortCall } from '../types';

// For now we accept portCalls as param (e.g., from mock or query)
export function usePortCalls(portCalls: PortCall[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return portCalls.filter((pc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        pc.vessel_agent.toLowerCase().includes(q) ||
        pc.origin_port.toLowerCase().includes(q) ||
        pc.vessel.vessel_name.toLowerCase().includes(q) ||
        pc.vessel.imo_no.toLowerCase().includes(q);
      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && pc.status === statusFilter;
    });
  }, [searchQuery, statusFilter, portCalls]);

  const stats = computeStats(portCalls);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredPortCalls: filtered,
    stats,
  };
}
