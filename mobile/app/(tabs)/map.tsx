import { AppleMaps, GoogleMaps } from "expo-maps";
import { Platform, Text } from "react-native";

export default function MapScreen() {
    if (Platform.OS === "ios") {
        return <AppleMaps.View style={{ flex: 1 }} />;
    } else if (Platform.OS === "android") {
        return (
            <GoogleMaps.View
                style={{ flex: 1 }}
                cameraPosition={{
                    coordinates: {
                        latitude: -18.159028,
                        longitude: 49.426028,
                    },
                    zoom: 16.3,
                }}
                // circles={[
                //     {
                //         center: {
                //             latitude: -18.159028,
                //             longitude: 49.426028,
                //         },
                //         radius: 100,
                //     },
                // ]}
                polygons={[
                    {
                        coordinates: [
                            { latitude: -18.158056, longitude: 49.424944 },
                            { latitude: -18.157667, longitude: 49.425222 },
                            { latitude: -18.159139, longitude: 49.427694 },
                            { latitude: -18.159556, longitude: 49.427806 },
                            { latitude: -18.159778, longitude: 49.427667 },
                        ],
                    },
                    {
                        coordinates: [
                            { latitude: -18.156778, longitude: 49.424917 },
                            { latitude: -18.156722, longitude: 49.425444 },
                            { latitude: -18.157139, longitude: 49.425722 },
                            { latitude: -18.157556, longitude: 49.425389 },
                            { latitude: -18.157417, longitude: 49.425111 },
                        ],
                    },
                ]}
                // polylines={[
                //     {
                //         coordinates: [
                //             { latitude: -18.159028, longitude: 49.426028 },
                //             { latitude: -18.160028, longitude: 49.427028 },
                //             { latitude: -18.161028, longitude: 49.426028 },
                //         ],
                //     },
                // ]}
            />
        );
    } else {
        return <Text>Maps are only available on Android and iOS</Text>;
    }
}
