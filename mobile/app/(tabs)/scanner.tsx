import { useScannerStore } from "@/lib/store";
import { CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Feature modules
import { CameraOverlay } from "@/features/scanner/components/CameraOverlay";
import { IdleState } from "@/features/scanner/components/IdleState";
import { ManualVinModal } from "@/features/scanner/components/ManualVinModal";
import { QuickActions } from "@/features/scanner/components/QuickActions";
import { RecentScans } from "@/features/scanner/components/RecentScans";
import { ScanHeader } from "@/features/scanner/components/ScanHeader";
import { ScanResultModal } from "@/features/scanner/components/ScanResultModal";
import { mockRecentScans } from "@/features/scanner/data/mock-recent-scans";
import { useVin } from "@/features/scanner/hooks/useVin";
import { isValidVin } from "@/features/scanner/lib/validation";
import { ScanFeedback } from "@/features/scanner/types";

export default function ScannerScreen() {
    const router = useRouter();
    const setVinGlobal = useScannerStore((s) => s.setVin);
    const [permission, requestPermission] = useCameraPermissions();

    // UI local states
    const [facing, setFacing] = useState<CameraType>("back");
    const [scanned, setScanned] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [scannerActive, setScannerActive] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [scannedData, setScannedData] = useState("");
    const [feedback, setFeedback] = useState<ScanFeedback | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const {
        vin: manualVin,
        setVin: setManualVin,
        error: manualError,
        validate: validateManual,
        isValid: manualIsValid,
    } = useVin("");

    const recentScans = mockRecentScans;

    // Actions
    const openManualEntry = () => {
        setShowManualEntry(true);
        setScannerActive(false);
        setManualVin("");
    };

    const handleManualSubmit = () => {
        if (!validateManual()) return;
        setShowManualEntry(false);
        setVinGlobal(manualVin);
        router.push("/(vehicles)" as any);
    };

    const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
        if (scanned) return;
        const raw = data.trim().toUpperCase();
        setScanned(true);
        if (isValidVin(raw)) {
            setFeedback({ type: "valid", code: raw });
            setVinGlobal(raw);
            setTimeout(() => {
                setFeedback(null);
                setScannerActive(false);
                router.push("/(vehicles)" as any);
                setTimeout(() => setScanned(false), 400);
            }, 650);
        } else {
            setFeedback({ type: "invalid", code: raw });
            setScannedData(raw);
            setTimeout(() => {
                setFeedback(null);
                setScanned(false);
            }, 1200);
        }
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
    const toggleCameraFacing = () =>
        setFacing((c) => (c === "back" ? "front" : "back"));
    const toggleFlash = () => setFlashOn((f) => !f);

    // Permission states simplified (could be extracted later)
    if (!permission || !permission.granted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-6">
                <Text className="text-base text-gray-600">
                    {!permission
                        ? "Chargement de la caméra..."
                        : "Autorisation caméra requise"}
                </Text>
                {!permission?.granted && (
                    <View className="mt-4">
                        <Text className="text-xs text-gray-500 mb-2 text-center max-w-[240px]">
                            Cette application nécessite l'accès à la caméra pour
                            scanner les codes.
                        </Text>
                        <Text
                            onPress={requestPermission}
                            className="text-emerald-600 font-semibold text-sm text-center"
                        >
                            Autoriser
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScanHeader />

            {/* Scanner Interface */}
            {!scannerActive ? (
                <IdleState onStart={startScanning} />
            ) : (
                <CameraOverlay
                    facing={facing}
                    flashOn={flashOn}
                    scanned={scanned}
                    feedback={feedback}
                    onBarcodeScanned={handleBarCodeScanned}
                    onStop={stopScanning}
                    onToggleFlash={toggleFlash}
                    onToggleFacing={toggleCameraFacing}
                />
            )}

            <QuickActions onManual={openManualEntry} />

            <RecentScans items={recentScans} />

            <ManualVinModal
                visible={showManualEntry}
                vin={manualVin}
                error={manualError}
                onChange={(t) => setManualVin(t.toUpperCase())}
                onClose={() => setShowManualEntry(false)}
                onSubmit={handleManualSubmit}
            />
            <ScanResultModal
                visible={showResult}
                code={scannedData}
                onClose={() => setShowResult(false)}
            />
        </SafeAreaView>
    );
}
