import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";

export default function ModalScreen() {
    return (
        <View style={styles.container}>
            <Text className="text-lg font-bold text-red-500">Modal</Text>
            <View style={styles.separator} />
            <EditScreenInfo path="app/modal.tsx" />

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});
