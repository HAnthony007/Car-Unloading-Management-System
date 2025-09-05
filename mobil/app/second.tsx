import { AppText } from "@/components/AppText";
import { View } from "react-native";

export default function IndexScreen() {
    return (
        <View className="justify-center flex-1 p-4">
            <AppText center size="heading" bold>
                Second Screen
            </AppText>
        </View>
    );
}