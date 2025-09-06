import { LogOut } from "lucide-react-native"
import { Text, TouchableOpacity, View } from "react-native"
import { handleLogout } from "../lib/logout"

export const LogoutButton = () => {
    return (

        <View className="mx-4 mb-4">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white p-4 rounded-xl border border-red-100"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut color="#DC2626" size={20} />
            <Text className="text-base font-semibold text-red-600 ml-2">Se déconnecter</Text>
          </TouchableOpacity>
        </View>
    )
}