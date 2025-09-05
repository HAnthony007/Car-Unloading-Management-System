import { AppText } from "@/components/AppText";
import { useRouter } from "expo-router";
import Link from "expo-router/link";
import { Button, View } from "react-native";

export default function IndexScreen() {
    const router = useRouter();
    return (
        <View className="justify-center flex-1 p-4 gap-4">
            <AppText center size="heading" bold className="text-blue-500">
                Index Screen
            </AppText>

            <Link href="/second" push asChild>
                <Button title="Push to /second" />
            </Link>

            <Link href="/third" push asChild>
                <Button title="Push to /third" />
            </Link>
        </View>
    );
}