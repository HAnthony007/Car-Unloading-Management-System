import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../modules/auth/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return <>{children}</>;
}
