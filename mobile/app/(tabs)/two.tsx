import { StyleSheet, Text, View } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";

export default function TabTwoScreen() {
    return (
        <View style={styles.container}>
            <Text className="text-lg font-bold text-red-500">Tab Two</Text>
            <View style={styles.separator} />
            <EditScreenInfo path="app/(tabs)/two.tsx" />
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
