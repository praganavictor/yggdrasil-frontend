import {
	BrowserMultiFormatReader,
	type IScannerControls,
} from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { CameraIcon, CameraOffIcon, ScanBarcodeIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type ScannerStatus = "idle" | "starting" | "scanning" | "denied" | "error";

interface BarcodeScannerCameraProps {
	onDetected: (barcode: string) => void;
}

const hints = new Map([
	[
		DecodeHintType.POSSIBLE_FORMATS,
		[
			BarcodeFormat.EAN_13,
			BarcodeFormat.EAN_8,
			BarcodeFormat.UPC_A,
			BarcodeFormat.UPC_E,
			BarcodeFormat.CODE_128,
			BarcodeFormat.CODE_39,
			BarcodeFormat.ITF,
			BarcodeFormat.QR_CODE,
		],
	],
]);

export function BarcodeScannerCamera({
	onDetected,
}: BarcodeScannerCameraProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const controlsRef = useRef<IScannerControls | null>(null);
	const detectedRef = useRef(false);
	const [status, setStatus] = useState<ScannerStatus>("idle");

	const stopScanning = useCallback(() => {
		controlsRef.current?.stop();
		controlsRef.current = null;
	}, []);

	useEffect(() => stopScanning, [stopScanning]);

	async function startScanning() {
		if (!videoRef.current) return;
		setStatus("starting");
		detectedRef.current = false;

		try {
			const reader = new BrowserMultiFormatReader(hints);
			controlsRef.current = await reader.decodeFromConstraints(
				{ video: { facingMode: "environment" } },
				videoRef.current,
				(result) => {
					if (!result || detectedRef.current) return;
					detectedRef.current = true;
					stopScanning();
					navigator.vibrate?.(100);
					setStatus("idle");
					onDetected(result.getText());
				},
			);
			setStatus("scanning");
		} catch (error) {
			stopScanning();
			const isPermissionError =
				error instanceof DOMException &&
				(error.name === "NotAllowedError" ||
					error.name === "PermissionDeniedError");
			setStatus(isPermissionError ? "denied" : "error");
		}
	}

	const isActive = status === "scanning" || status === "starting";

	return (
		<div className="flex flex-col gap-3">
			<div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-black">
				<video
					ref={videoRef}
					className={`h-full w-full object-cover ${isActive ? "" : "hidden"}`}
					muted
					playsInline
				/>

				{status === "scanning" && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<div className="h-24 w-4/5 rounded-lg border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
					</div>
				)}

				{!isActive && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
						{status === "denied" ? (
							<>
								<CameraOffIcon className="size-8 text-white/70" />
								<p className="text-sm text-white/80">
									Permissão de câmera negada. Libere o acesso à câmera nas
									configurações do navegador e tente novamente.
								</p>
							</>
						) : status === "error" ? (
							<>
								<CameraOffIcon className="size-8 text-white/70" />
								<p className="text-sm text-white/80">
									Não foi possível acessar a câmera do dispositivo.
								</p>
							</>
						) : (
							<>
								<ScanBarcodeIcon className="size-8 text-white/70" />
								<p className="text-sm text-white/80">
									Aponte a câmera para o código de barras do produto. Será
									pedida permissão para usar a câmera.
								</p>
							</>
						)}
						<Button onClick={startScanning} className="gap-2">
							<CameraIcon className="size-4" />
							{status === "idle" ? "Ativar câmera" : "Tentar novamente"}
						</Button>
					</div>
				)}
			</div>

			{isActive && (
				<Button
					variant="outline"
					onClick={() => {
						stopScanning();
						setStatus("idle");
					}}
				>
					Parar leitura
				</Button>
			)}
		</div>
	);
}
