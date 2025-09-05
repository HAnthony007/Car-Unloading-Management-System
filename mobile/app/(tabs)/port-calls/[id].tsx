import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { usePortCallDetail } from '@/src/modules/port-calls/hooks/usePortCallDetail';
import { formatLocal } from '@/src/modules/port-calls/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, View as RNView, TouchableOpacity } from 'react-native';

export default function PortCallDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { portCall, discharges, vehicles } = usePortCallDetail(id);

  if (portCall.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (portCall.error) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="mt-3 text-red-600">{(portCall.error as Error).message}</Text>
        <TouchableOpacity className="mt-4 bg-indigo-600 px-4 py-2 rounded" onPress={() => router.back()}>
          <Text className="text-white font-bold">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pc: any = portCall.data;
  const status = (pc?.status ?? 'unknown').toUpperCase();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="pr-2 py-1">
          <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <Text className="text-lg font-extrabold">Port Call #{pc?.port_call_id}</Text>
        <RNView style={{ width: 22 }} />
      </View>

      <View className="p-4">
        <View className="p-4 rounded-xl bg-white dark:bg-gray-800 mb-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-bold">{pc?.vessel?.vessel_name ?? '—'}</Text>
            <View className="px-2 py-1 rounded-full bg-gray-100">
              <Text className="text-[10px] font-bold">{status}</Text>
            </View>
          </View>
          <Text className="text-gray-600 mt-2">Agent: {pc?.vessel_agent}</Text>
          <Text className="text-gray-500 mt-1">Origine: {pc?.origin_port}</Text>
          <Text className="text-gray-800 mt-2">ETA: {formatLocal(pc?.estimated_arrival)}</Text>
        </View>

        <View className="p-4 rounded-xl bg-white dark:bg-gray-800">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-bold">Véhicules</Text>
            <Text className="text-xs text-gray-500">{vehicles.data?.total ?? vehicles.data?.vehicles?.length ?? 0} éléments</Text>
          </View>
          {vehicles.isLoading ? (
            <ActivityIndicator size="small" color={Colors.light.tint} />
          ) : (
            <FlatList
              data={vehicles.data?.vehicles ?? []}
              keyExtractor={(item) => String(item.vehicle_id)}
              ItemSeparatorComponent={() => <View className="h-3" />}
              renderItem={({ item }) => (
                <View className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-semibold" numberOfLines={1}>{item.vin}</Text>
                    {item.is_primed && (
                      <View className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-700">
                        <Text className="text-[10px] font-bold text-indigo-700 dark:text-white">PRIMED</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-700 mt-1" numberOfLines={1}>{item.make} {item.model} {item.year ? '('+item.year+')' : ''}</Text>
                  <View className="flex-row mt-1 flex-wrap">
                    {!!item.color && <Text className="text-[11px] mr-2 text-gray-500">Couleur: {item.color}</Text>}
                    <Text className="text-[11px] mr-2 text-gray-500">Type: {item.type}</Text>
                    <Text className="text-[11px] text-gray-500">État: {item.vehicle_condition}</Text>
                  </View>
                  {!!item.vehicle_observation && item.vehicle_observation !== 'Néant' && (
                    <Text className="text-[11px] mt-1 text-amber-600" numberOfLines={2}>{item.vehicle_observation}</Text>
                  )}
                  {!!item.ship_location && (
                    <Text className="text-[11px] mt-1 text-gray-400">Loc: {item.ship_location}</Text>
                  )}
                </View>
              )}
              ListEmptyComponent={() => (
                <View className="items-center py-6">
                  <Text className="text-gray-500">Aucun véhicule trouvé pour cette escale.</Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}
