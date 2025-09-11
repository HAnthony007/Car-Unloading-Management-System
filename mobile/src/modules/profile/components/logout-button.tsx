import { Button } from "@/src/components/ui/button";
import { LogOut } from "lucide-react-native";
import { View } from "react-native";

export const LogoutButton = () => {
    return (
        <View className="mx-4 mb-4">
            <Button
                className="flex-row items-center justify-center bg-white p-4 rounded-xl border border-red-100"
                textClassName="text-red-600 ml-2"
                leftIcon={<LogOut color="#DC2626" size={20} />}
                variant="secondary"
                title="Déconnexion..."
                onPress={() => {}}
                loading={false}
            />
        </View>
    );
};
