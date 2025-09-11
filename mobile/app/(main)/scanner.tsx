import { ManualVinModal } from "@/src/modules/scanner/components/manual-vin-modal";
import { QuickActions } from "@/src/modules/scanner/components/quick-action";
import { RecentScans } from "@/src/modules/scanner/components/recent-scan";
import { ScanHeader } from "@/src/modules/scanner/components/scan-header";
import { ScannerInterface } from "@/src/modules/scanner/components/scan-interface";
import { ScanResultModal } from "@/src/modules/scanner/components/scan-result.modal";
import { mockPortCalls } from "@/src/modules/scanner/data/mock-port-calls";
import { mockRecentScans } from "@/src/modules/scanner/data/mock-recent-scan";
import { useVin } from "@/src/modules/scanner/hooks/useVin";
import { isValidVin } from "@/src/modules/scanner/lib/validation";
import { useScannerStore } from "@/src/modules/scanner/stores/scanner-store";
import { ScanFeedback } from "@/src/modules/scanner/type";
import { CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

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
                            Cette application nécessite l&apos;accès à la caméra
                            pour scanner les codes.
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
            <ScanHeader portCalls={mockPortCalls} />

            {/* Scanner Interface */}
            <ScannerInterface
                scannerActive={scannerActive}
                onStart={startScanning}
                facing={facing}
                flashOn={flashOn}
                scanned={scanned}
                feedback={feedback}
                onBarcodeScanned={handleBarCodeScanned}
                onStop={stopScanning}
                onToggleFlash={toggleFlash}
                onToggleFacing={toggleCameraFacing}
            />

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
