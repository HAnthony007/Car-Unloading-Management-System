import { Text, View } from "react-native";
import { useAuth } from "../../auth/hooks/use-auth";

export const UserInfo = () => {
    const { user } = useAuth();
    return (
        <View className="bg-white mx-4 mt-4 mb-4 rounded-xl p-5 shadow-sm">
            <View className="items-center mb-4">
                <View className="w-20 h-20 rounded-full bg-emerald-600 items-center justify-center">
                    <Text className="text-2xl font-bold text-white">JR</Text>
                </View>
            </View>
            <View className="items-center">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {user?.full_name}
                </Text>
                <Text className="text-sm text-gray-500 mb-4">
                    {user?.email}
                </Text>
                <View className="w-full">
                    <View className="flex-row justify-between py-2 border-b border-gray-100">
                        <Text className="text-sm text-gray-500">Rôle</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                            {user?.role.display_name}
                        </Text>
                    </View>
                    <View className="flex-row justify-between py-2 border-b border-gray-100">
                        <Text className="text-sm text-gray-500">
                            Département
                        </Text>
                        <Text className="text-sm font-semibold text-gray-900">
                            Expertise
                        </Text>
                    </View>
                    <View className="flex-row justify-between py-2">
                        <Text className="text-sm text-gray-500">ID Agent</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                            {user?.matriculation_number}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
