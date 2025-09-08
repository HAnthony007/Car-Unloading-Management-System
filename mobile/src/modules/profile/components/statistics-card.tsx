import { Text, View } from "react-native"

export const StatisticsCard = () => {
  return (
        <View className="bg-white mx-4 mb-4 rounded-xl p-5 shadow-sm">
          <Text className="text-base font-semibold text-gray-900 mb-4">Statistiques personnelles</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-emerald-600 mb-1">156</Text>
                <Text className="text-xs text-gray-500 text-center">Véhicules scannés</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-emerald-600 mb-1">23</Text>
                <Text className="text-xs text-gray-500 text-center">Rapports générés</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-emerald-600 mb-1">7</Text>
                <Text className="text-xs text-gray-500 text-center">Jours actifs</Text>
              </View>
            </View>
        </View>
    )
}