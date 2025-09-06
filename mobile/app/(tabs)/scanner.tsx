import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import {
    Camera,
    CircleCheck as CheckCircle,
    Flashlight,
    FlashlightOff,
    RotateCcw,
    ScanLine,
    X,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScannerScreen() {
    const [facing, setFacing] = useState<CameraType>("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [scannerActive, setScannerActive] = useState(false);
    const [scannedData, setScannedData] = useState<string>("");
    const [showResult, setShowResult] = useState(false);

    const handleBarCodeScanned = ({
        type,
        data,
    }: {
        type: string;
        data: string;
    }) => {
        if (scanned) return;

        setScanned(true);
        setScannedData(data);
        setShowResult(true);
        setScannerActive(false);

        // Simulation du traitement du code scanné
        setTimeout(() => {
            Alert.alert("Code scanné avec succès!", `Données: ${data}`, [
                { text: "OK", onPress: () => setScanned(false) },
            ]);
        }, 1000);
    };

    const startScanning = () => {
        if (!permission?.granted) {
            requestPermission();
            return;
        }
        setScannerActive(true);
        setScanned(false);
    };

    const stopScanning = () => {
        setScannerActive(false);
        setScanned(false);
    };

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const toggleFlash = () => {
        setFlashOn(!flashOn);
    };

    if (!permission) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center p-6">
                    <Camera color="#6B7280" size={64} />
                    <Text className="text-base text-gray-500 text-center mt-4">
                        Chargement de la caméra...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center p-6">
                    <Camera color="#6B7280" size={64} />
                    <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                        Autorisation caméra requise
                    </Text>
                    <Text className="text-base text-gray-500 text-center mb-6">
                        Cette application a besoin d'accéder à votre caméra pour
                        scanner les codes QR et codes-barres.
                    </Text>
                    <TouchableOpacity
                        className="bg-emerald-600 px-6 py-3 rounded-lg"
                        onPress={requestPermission}
                    >
                        <Text className="text-white text-base font-semibold">
                            Autoriser la caméra
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="px-4 py-4 bg-white border-b border-gray-200">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                    Scanner QR/Code-barres
                </Text>
                <Text className="text-sm text-gray-500">
                    Scannez les documents véhicules
                </Text>
            </View>

            {/* Scanner Interface */}
            {!scannerActive ? (
                <View className="flex-1 p-4">
                    <View className="flex-1 items-center justify-center bg-white rounded-xl p-6 mb-4">
                        <ScanLine color="#059669" size={80} />
                        <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                            Prêt à scanner
                        </Text>
                        <Text className="text-sm text-gray-500 text-center">
                            Appuyez sur le bouton pour démarrer la numérisation
                            des codes QR ou codes-barres
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-emerald-600 p-4 rounded-xl gap-2"
                        onPress={startScanning}
                    >
                        <Camera color="#FFFFFF" size={24} />
                        <Text className="text-white text-base font-semibold">
                            Démarrer le scan
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="flex-1 m-4 rounded-xl overflow-hidden">
                    <CameraView
                        style={{ flex: 1 }}
                        facing={facing}
                        onBarcodeScanned={
                            scanned ? undefined : handleBarCodeScanned
                        }
                        barcodeScannerSettings={{
                            barcodeTypes: [
                                "qr",
                                "pdf417",
                                "code128",
                                "code39",
                                "ean13",
                                "ean8",
                            ],
                        }}
                    >
                        {/* Overlay */}
                        <View className="flex-1 bg-black/30">
                            {/* Top bar */}
                            <View className="flex-row justify-between p-4">
                                <TouchableOpacity
                                    className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
                                    onPress={stopScanning}
                                >
                                    <X color="#FFFFFF" size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
                                    onPress={toggleFlash}
                                >
                                    {flashOn ? (
                                        <FlashlightOff
                                            color="#FFFFFF"
                                            size={24}
                                        />
                                    ) : (
                                        <Flashlight color="#FFFFFF" size={24} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Scanning area */}
                            <View className="flex-1 items-center justify-center p-8">
                                <View className="w-[250px] h-[250px] relative">
                                    <View
                                        className="absolute w-7 h-7 border-[3px] border-white"
                                        style={{ top: 0, left: 0 }}
                                    />
                                    <View
                                        className="absolute w-7 h-7 border-[3px] border-white"
                                        style={{ top: 0, right: 0 }}
                                    />
                                    <View
                                        className="absolute w-7 h-7 border-[3px] border-white"
                                        style={{ bottom: 0, left: 0 }}
                                    />
                                    <View
                                        className="absolute w-7 h-7 border-[3px] border-white"
                                        style={{ bottom: 0, right: 0 }}
                                    />
                                </View>
                                <Text className="text-white text-base text-center mt-6">
                                    Placez le code QR ou code-barres dans le
                                    cadre
                                </Text>
                            </View>

                            {/* Bottom controls */}
                            <View className="items-center p-4">
                                <TouchableOpacity
                                    className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
                                    onPress={toggleCameraFacing}
                                >
                                    <RotateCcw color="#FFFFFF" size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </CameraView>
                </View>
            )}

            {/* Quick Actions */}
            <View className="p-4">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                    Actions rapides
                </Text>
                <View className="flex-row gap-3">
                    <TouchableOpacity className="flex-1 bg-white p-3 rounded-lg items-center">
                        <Text className="text-sm font-medium text-emerald-600">
                            Saisie manuelle
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white p-3 rounded-lg items-center">
                        <Text className="text-sm font-medium text-emerald-600">
                            Historique
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Recent Scans */}
            <View className="p-4">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                    Derniers scans
                </Text>
                <View className="bg-white rounded-lg p-4">
                    {[
                        {
                            id: 1,
                            data: "VH001234567",
                            time: "10:30",
                            type: "QR Code",
                            vehicle: "Toyota RAV4",
                        },
                        {
                            id: 2,
                            data: "VH009876543",
                            time: "09:15",
                            type: "Code-barres",
                            vehicle: "BMW X3",
                        },
                    ].map((scan) => (
                        <View
                            key={scan.id}
                            className="flex-row items-center py-2 border-b border-gray-100"
                        >
                            <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mr-3">
                                <CheckCircle color="#059669" size={20} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900">
                                    {scan.vehicle}
                                </Text>
                                <Text className="text-xs text-gray-500">
                                    {scan.data}
                                </Text>
                                <Text className="text-xs text-gray-500">
                                    {scan.time} - {scan.type}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showResult}
                onRequestClose={() => setShowResult(false)}
            >
                <View className="flex-1 bg-black/50 items-center justify-center">
                    <View className="bg-white rounded-xl p-6 items-center m-6 min-w-[280px]">
                        <CheckCircle color="#059669" size={64} />
                        <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                            Scan réussi!
                        </Text>
                        <Text className="text-sm text-gray-500 text-center mb-4">
                            Code scanné: {scannedData}
                        </Text>
                        <TouchableOpacity
                            className="bg-emerald-600 px-6 py-3 rounded-lg"
                            onPress={() => setShowResult(false)}
                        >
                            <Text className="text-white text-base font-semibold">
                                Continuer
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
