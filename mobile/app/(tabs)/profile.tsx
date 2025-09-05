import { StyledButton } from '@/components/ui/StyledButton';
import { useAuth } from '@/providers/AuthProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 p-6">
        <View className="items-center mt-2">
          <View className="w-20 h-20 rounded-2xl bg-primary items-center justify-center">
            <FontAwesome name="user" size={36} color="#fff" />
          </View>
          <Text className="mt-3 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {user?.name ?? 'Agent'}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">{user?.email ?? '-'}</Text>
          <Text className="text-gray-500 dark:text-gray-400">{user?.role ?? 'Utilisateur'}</Text>
        </View>

        <View className="mt-8 gap-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Statistiques personnelles
          </Text>
          <View className="flex-row gap-3">
            <StatCard label="Véhicules traités" value="128" icon="truck" />
            <StatCard label="Taux réussite" value="98%" icon="check" />
          </View>
          <View className="flex-row gap-3">
            <StatCard label="Heures actives" value="42h" icon="clock-o" />
            <StatCard label="Incidents" value="0" icon="warning" />
          </View>
        </View>

        <View className="mt-auto">
          <StyledButton title="Se déconnecter" onPress={logout} variant="primary" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ComponentProps<typeof FontAwesome>['name'] }) {
  return (
    <View className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
        <View className="w-8 h-8 rounded-lg bg-primary/10 items-center justify-center">
          <FontAwesome name={icon} size={16} color="#16a34a" />
        </View>
      </View>
      <Text className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</Text>
    </View>
  );
}
