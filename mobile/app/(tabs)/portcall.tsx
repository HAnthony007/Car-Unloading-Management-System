
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { usePortCalls } from '@/src/modules/port-calls/hooks/usePortCalls';
import { formatLocal } from '@/src/modules/port-calls/lib/utils';
import { usePortCallsStore } from '@/src/modules/port-calls/store/usePortCallsStore';
import { PortCall } from '@/src/modules/port-calls/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native';

export default function PortCallScreen() {
  const router = useRouter();
  const store = usePortCallsStore();
  const { data, isLoading, refetch, isFetching, error: queryError } = usePortCalls({ q: store.q, status: store.status });

  const loading = isLoading || isFetching;
  const portCalls = (data?.data ?? []) as PortCall[];
  const error = queryError ? (queryError as Error).message : null;

  function onRefresh() {
    refetch();
  }

  const filtered = useMemo(() => {
  let list = portCalls.slice();

    if (store.status !== 'all') {
      list = list.filter((p) => (p.status ?? '').toLowerCase() === store.status);
    }

    if (store.q && String(store.q).trim()) {
      const q = String(store.q).toLowerCase();
      list = list.filter(
        (p) =>
          (p.vessel_agent ?? '').toLowerCase().includes(q) ||
          (p.origin_port ?? '').toLowerCase().includes(q) ||
          (p.vessel?.vessel_name ?? '').toLowerCase().includes(q) ||
          String(p.port_call_id).includes(q),
      );
    }

  if (store.sortBy === 'eta') {
      list.sort((a, b) => {
        const ta = a.estimated_arrival ? new Date(a.estimated_arrival).getTime() : Infinity;
        const tb = b.estimated_arrival ? new Date(b.estimated_arrival).getTime() : Infinity;
        return ta - tb;
      });
    } else if (store.sortBy === 'vehicles') {
      list.sort((a, b) => (b.vehicles_number ?? 0) - (a.vehicles_number ?? 0));
    } else if (store.sortBy === 'created') {
      list.sort((a, b) => {
        const ta = a['created_at'] ? new Date((a as any).created_at).getTime() : 0;
        const tb = b['created_at'] ? new Date((b as any).created_at).getTime() : 0;
        return tb - ta;
      });
    }

    return list;
  }, [portCalls, store.q, store.status, store.sortBy]);

  function renderItem({ item }: { item: PortCall }) {
    const eta = formatLocal(item.estimated_arrival);
    const badge = getStatusBadge(item.status);
    return (
      <TouchableOpacity onPress={() => router.push(`/port-calls/${item.port_call_id}`)} className="active:opacity-80">
      <View className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Ionicons name="boat-outline" size={18} color="#4b5563" />
            <Text className="text-base font-bold">{item.vessel?.vessel_name ?? '—'}</Text>
          </View>
          <View className="px-2 py-1 rounded-full" style={{ backgroundColor: badge.bg }}>
            <Text className="text-[10px] font-bold" style={{ color: badge.fg }}>{badge.label}</Text>
          </View>
        </View>

        <View className="mt-2 flex-row items-center">
          <Ionicons name="business-outline" size={16} color="#6b7280" />
          <Text className="ml-2 text-gray-600">{item.vessel_agent}</Text>
        </View>

        <View className="mt-1 flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text className="ml-2 text-gray-500">{item.origin_port}</Text>
        </View>

        <View className="flex-row justify-between mt-3">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#374151" />
            <Text className="ml-1 text-gray-800">{eta}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="car-outline" size={16} color="#374151" />
            <Text className="ml-1 text-gray-800 font-semibold">{item.vehicles_number ?? 0} véhicules</Text>
          </View>
        </View>
  </View>
  </TouchableOpacity>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <View className="p-4 border-b border-gray-200" lightColor={Colors.light.background} darkColor={Colors.dark.background}>
        <Text className="text-xl font-extrabold text-black dark:text-white">Port Calls</Text>
        <Text className="text-sm text-gray-600 mt-1">Liste des prochains port calls — recherche, filtre et tri</Text>
        {error ? (
          <View className="mt-3 p-3 bg-red-50 rounded flex-row items-center justify-between">
            <Text className="text-red-800 flex-1 mr-2">{error}</Text>
            <TouchableOpacity className="bg-indigo-600 px-3 py-1 rounded" onPress={() => refetch()}>
              <Text className="text-white font-bold">Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View className="mt-3">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
            <Ionicons name="search" size={18} color="#6b7280" />
            <TextInput
              placeholder="Rechercher (navire, agent, port, id)"
              className="flex-1 ml-2 text-base"
              value={store.q}
              onChangeText={(v) => store.setQ(v)}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        <View className="mt-3 flex-row justify-between items-center">
          <View className="flex-row space-x-2">
            <Pill label="Tous" active={store.status === 'all'} onPress={() => store.setStatus('all')} activeBgClass="bg-indigo-600" activeTextClass="text-white font-bold" />
            <Pill label="Pending" active={store.status === 'pending'} onPress={() => store.setStatus('pending')} activeBgClass="bg-amber-500" activeTextClass="text-white font-bold" />
            <Pill label="In progress" active={store.status === 'in_progress'} onPress={() => store.setStatus('in_progress')} activeBgClass="bg-blue-600" activeTextClass="text-white font-bold" />
            <Pill label="Completed" active={store.status === 'completed'} onPress={() => store.setStatus('completed')} activeBgClass="bg-green-600" activeTextClass="text-white font-bold" />
          </View>

          <View className="flex-row">
            <Pill label="ETA" active={store.sortBy === 'eta'} onPress={() => store.setSortBy('eta')} small activeBgClass="bg-purple-600" activeTextClass="text-white font-bold" />
            <Pill label="Véhicules" active={store.sortBy === 'vehicles'} onPress={() => store.setSortBy('vehicles')} small activeBgClass="bg-rose-600" activeTextClass="text-white font-bold" />
            <Pill label="Recent" active={store.sortBy === 'created'} onPress={() => store.setSortBy('created')} small activeBgClass="bg-slate-800" activeTextClass="text-white font-bold" />
          </View>
        </View>
      </View>

      <View className="flex-1 p-3">
        {isLoading && !isFetching ? (
          <ActivityIndicator size="large" color={Colors.light.tint} style={{ marginTop: 24 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(i) => String(i.port_call_id)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View className="h-3" />}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />}
            ListEmptyComponent={() => (
              <View className="items-center mt-10">
                <Ionicons name="boat-outline" size={36} color="#9ca3af" />
                <Text className="text-gray-500 mt-2">Aucun port call trouvé</Text>
                <Text className="text-gray-400 text-xs mt-1">Essayez d’ajuster la recherche ou les filtres.</Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <View className="mb-2">
                <Text className="text-xs text-gray-500">{filtered.length} résultats</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

function statusStyle(status?: string | null) {
  const s = (status ?? '').toLowerCase();
  if (s === 'pending') return { color: '#ff9f1c' };
  if (s === 'completed') return { color: '#2ecc71' };
  if (s === 'in_progress') return { color: '#3498db' };
  return { color: '#8e8e93' };
}

function Pill({ label, active, onPress, small, activeBgClass = 'bg-indigo-600', activeTextClass = 'text-white font-bold' }: { label: string; active?: boolean; onPress?: () => void; small?: boolean; activeBgClass?: string; activeTextClass?: string }) {
  const base = `${small ? 'px-2 py-1' : 'px-3 py-2'} rounded-full mr-2`;
  const containerClass = active ? `${activeBgClass} ${base}` : `bg-white border border-gray-300 ${base}`;
  const textClass = active ? activeTextClass : 'text-gray-700';
  return (
    <TouchableOpacity onPress={onPress} className={containerClass}>
      <Text className={textClass}>{label}</Text>
    </TouchableOpacity>
  );
}

// styles migrated to nativewind className usage

function getStatusBadge(status?: string | null) {
  const s = (status ?? '').toLowerCase();
  if (s === 'pending') return { bg: '#FFF4E5', fg: '#B25E09', label: 'PENDING' };
  if (s === 'completed') return { bg: '#E9F9EF', fg: '#1B7F4D', label: 'COMPLETED' };
  if (s === 'in_progress') return { bg: '#E8F1FE', fg: '#1F5BD8', label: 'IN PROGRESS' };
  return { bg: '#F3F4F6', fg: '#6B7280', label: (status ?? 'UNKNOWN').toUpperCase() };
}
