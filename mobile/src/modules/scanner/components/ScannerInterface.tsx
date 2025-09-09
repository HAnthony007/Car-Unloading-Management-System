import { CameraType } from "expo-camera";

import { ScanFeedback } from "@/modules/scanner/types";
import { CameraOverlay } from "./CameraOverlay";
import { IdleState } from "./IdleState";

type BarcodeEvent = { type: string; data: string };

interface Props {
    scannerActive: boolean;
    onStart: () => void;
    facing: CameraType;
    flashOn: boolean;
    scanned: boolean;
    feedback: ScanFeedback | null;
    onBarcodeScanned: (e: BarcodeEvent) => void;
    onStop: () => void;
    onToggleFlash: () => void;
    onToggleFacing: () => void;
}

export function ScannerInterface({
    scannerActive,
    onStart,
    facing,
    flashOn,
    scanned,
    feedback,
    onBarcodeScanned,
    onStop,
    onToggleFlash,
    onToggleFacing,
}: Props) {
    return !scannerActive ? (
        <IdleState onStart={onStart} />
    ) : (
        <CameraOverlay
            facing={facing}
            flashOn={flashOn}
            scanned={scanned}
            feedback={feedback}
            onBarcodeScanned={onBarcodeScanned}
            onStop={onStop}
            onToggleFlash={onToggleFlash}
            onToggleFacing={onToggleFacing}
        />
    );
}

export default ScannerInterface;
