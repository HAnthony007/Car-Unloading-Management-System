import { CameraType, CameraView } from "expo-camera";
import {
    CheckCircle,
    Flashlight,
    FlashlightOff,
    RotateCcw,
    X,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScanFeedback } from "../type";

interface CameraOverlayProps {
    facing: CameraType;
    flashOn: boolean;
    scanned: boolean;
    feedback: ScanFeedback | null;
    onBarcodeScanned: (data: { type: string; data: string }) => void;
    onStop(): void;
    onToggleFlash(): void;
    onToggleFacing(): void;
}

export function CameraOverlay({
    facing,
    flashOn,
    scanned,
    feedback,
    onBarcodeScanned,
    onStop,
    onToggleFlash,
    onToggleFacing,
}: CameraOverlayProps) {
    return (
        <View className="flex-1 m-4 rounded-xl overflow-hidden">
            <CameraView
                style={{ flex: 1 }}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
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
                <View className="flex-1 bg-black/30">
                    <View className="flex-row justify-between p-4">
                        <TouchableOpacity
                            className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
                            onPress={onStop}
                        >
                            <X color="#FFFFFF" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
                            onPress={onToggleFlash}
                        >
                            {flashOn ? (
                                <FlashlightOff color="#FFFFFF" size={24} />
                            ) : (
                                <Flashlight color="#FFFFFF" size={24} />
                            )}
                        </TouchableOpacity>
                    </View>
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
                        {!feedback && (
                            <Text className="text-white text-base text-center mt-6">
                                Placez le code dans le cadre
                            </Text>
                        )}
                        {feedback && (
                            <View
                                className={`mt-6 px-4 py-3 rounded-xl flex-row items-center ${feedback.type === "valid" ? "bg-emerald-600" : "bg-red-600"}`}
                            >
                                {feedback.type === "valid" ? (
                                    <CheckCircle color="#fff" size={22} />
                                ) : (
                                    <X color="#fff" size={22} />
                                )}
                                <View className="ml-3">
                                    <Text className="text-white text-sm font-semibold">
                                        {feedback.type === "valid"
                                            ? "VIN valide"
                                            : "Code invalide"}
                                    </Text>
                                    <Text className="text-white/80 text-[11px] tracking-widest">
                                        {feedback.code}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                    <View className="items-center p-4">
                        <TouchableOpacity
                            className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
                            onPress={onToggleFacing}
                        >
                            <RotateCcw color="#FFFFFF" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}
