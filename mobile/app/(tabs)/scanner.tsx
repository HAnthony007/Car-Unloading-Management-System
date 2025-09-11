import { api } from "@/src/lib/axios-instance";
import { Storage } from "@/src/lib/storage";
import { ManualVinModal } from "@/src/modules/scanner/components/manual-vin-modal";
import { QuickActions } from "@/src/modules/scanner/components/quick-action";
import { RecentScans } from "@/src/modules/scanner/components/recent-scan";
import { ScanHeader } from "@/src/modules/scanner/components/scan-header";
import { ScannerInterface } from "@/src/modules/scanner/components/scan-interface";
import { ScanResultModal } from "@/src/modules/scanner/components/scan-result.modal";
import { mockRecentScans } from "@/src/modules/scanner/data/mock-recent-scan";
import { useCheckVehicleInPortCall } from "@/src/modules/scanner/hooks/useCheckVehicleInPortCall";
import { useVin } from "@/src/modules/scanner/hooks/useVin";
import { isValidVin } from "@/src/modules/scanner/lib/validation";
import { useScannerStore } from "@/src/modules/scanner/stores/scanner-store";
import { ScanFeedback } from "@/src/modules/scanner/type";
import { CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScannerScreen() {
    const router = useRouter();
    const setVinGlobal = useScannerStore((s) => s.setVin);
    const selectedPortCall = useScannerStore((s) => s.selectedPortCall);
    const setVinCheckResult = useScannerStore(
        (s) => (s as any).setVinCheckResult
    );
    const { checkVin } = useCheckVehicleInPortCall({
        portCallId: selectedPortCall,
    });
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

    const handleManualSubmit = async () => {
        if (!validateManual()) return;
        setShowManualEntry(false);
        setVinGlobal(manualVin);
        if (selectedPortCall) {
            try {
                const resp = await checkVin(manualVin);
                setVinCheckResult?.(resp);
                // console.log("[VIN CHECK][MANUAL]", resp);
                console.log(
                    "[VIN  VEHICLE ID CHECK][vehicle_id]",
                    resp.vehicle_id
                );
                // If vehicle exists and discharge id present -> fetch discharge
                if (resp.vehicle_exists && resp.discharge_id) {
                    try {
                        const { data } = await api.get(
                            `/discharges/${resp.discharge_id}`
                        );
                        console.log("[DISCHARGE][GET]", data);
                    } catch (err: any) {
                        console.log(
                            "[DISCHARGE][GET][ERROR]",
                            err?.response?.data || err.message
                        );
                    }
                }
                // If vehicle exists but no discharge yet -> create discharge for that vehicle
                else if (resp.vehicle_exists && !resp.discharge_id) {
                    try {
                        const user = await Storage.getUser();
                        const agentId = user?.user_id ?? null;
                        const payload = {
                            discharge_date: new Date().toISOString(),
                            port_call_id: Number(selectedPortCall),
                            vehicle_id: resp.vehicle_id,
                            agent_id: agentId,
                        };
                        const { data: created } = await api.post(
                            `/discharges`,
                            payload
                        );
                        console.log("[DISCHARGE][CREATE]", created);
                    } catch (err: any) {
                        console.log(
                            "[DISCHARGE][CREATE][ERROR]",
                            err?.response?.data || err.message
                        );
                    }
                }
                // If vehicle does not exist -> create discharge record (fallback)
                else if (!resp.vehicle_exists) {
                    try {
                        const user = await Storage.getUser();
                        const agentId = user?.user_id ?? null;
                        const payload = {
                            discharge_date: new Date().toISOString(),
                            port_call_id: Number(selectedPortCall),
                            vehicle_id: resp.vehicle_id,
                            agent_id: agentId,
                        };
                        const { data: created } = await api.post(
                            `/discharges`,
                            payload
                        );
                        console.log("[DISCHARGE][CREATE]", created);
                    } catch (err: any) {
                        console.log(
                            "[DISCHARGE][CREATE][ERROR]",
                            err?.response?.data || err.message
                        );
                    }
                }
            } catch (e: any) {
                console.log(
                    "[VIN CHECK][MANUAL][ERROR]",
                    e?.response?.data || e.message
                );
            }
        } else {
            console.log(
                "[VIN CHECK][MANUAL] Aucun port call sélectionné, skip backend check"
            );
        }
        router.push("/(vehicles)" as any);
    };

    const handleBarCodeScanned = async ({
        data,
    }: {
        type: string;
        data: string;
    }) => {
        if (scanned) return;
        const raw = data.trim().toUpperCase();
        setScanned(true);
        if (isValidVin(raw)) {
            setFeedback({ type: "valid", code: raw });
            setVinGlobal(raw);
            if (selectedPortCall) {
                try {
                    const resp = await checkVin(raw);
                    setVinCheckResult?.(resp);
                    console.log("[VIN CHECK][SCAN]", resp);
                    if (resp.vehicle_exists && resp.discharge_id) {
                        try {
                            const { data } = await api.get(
                                `/discharges/${resp.discharge_id}`
                            );
                            console.log("[DISCHARGE][GET]", data);
                        } catch (err: any) {
                            console.log(
                                "[DISCHARGE][GET][ERROR]",
                                err?.response?.data || err.message
                            );
                        }
                    } else if (resp.vehicle_exists && !resp.discharge_id) {
                        try {
                            const user = await Storage.getUser();
                            const agentId = user?.user_id ?? null;
                            const payload = {
                                discharge_date: new Date().toISOString(),
                                port_call_id: Number(selectedPortCall),
                                vehicle_id: resp.vehicle_id,
                                agent_id: agentId,
                            };
                            const { data: created } = await api.post(
                                `/discharges`,
                                payload
                            );
                            console.log("[DISCHARGE][CREATE]", created);
                        } catch (err: any) {
                            console.log(
                                "[DISCHARGE][CREATE][ERROR]",
                                err?.response?.data || err.message
                            );
                        }
                    } else if (!resp.vehicle_exists) {
                        try {
                            const user = await Storage.getUser();
                            const agentId = user?.user_id ?? null;
                            const payload = {
                                discharge_date: new Date().toISOString(),
                                port_call_id: Number(selectedPortCall),
                                vehicle_id: resp.vehicle_id,
                                agent_id: agentId,
                            };
                            const { data: created } = await api.post(
                                `/discharges`,
                                payload
                            );
                            console.log("[DISCHARGE][CREATE]", created);
                        } catch (err: any) {
                            console.log(
                                "[DISCHARGE][CREATE][ERROR]",
                                err?.response?.data || err.message
                            );
                        }
                    }
                } catch (e: any) {
                    console.log(
                        "[VIN CHECK][SCAN][ERROR]",
                        e?.response?.data || e.message
                    );
                }
            } else {
                console.log(
                    "[VIN CHECK][SCAN] Aucun port call sélectionné, skip backend check"
                );
            }
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
            <ScanHeader />

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
