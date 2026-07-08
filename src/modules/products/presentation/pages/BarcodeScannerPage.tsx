import {
	Loader2Icon,
	MinusIcon,
	PackageSearchIcon,
	PlusIcon,
	SearchIcon,
	XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/modules/products/domain/entities/Product";
import { AssociateBarcodeSheet } from "@/modules/products/presentation/components/AssociateBarcodeSheet";
import { BarcodeScannerCamera } from "@/modules/products/presentation/components/BarcodeScannerCamera";
import { StockBadge } from "@/modules/products/presentation/components/StockBadge";
import { useProductByBarcode } from "@/modules/products/presentation/hooks/useProductByBarcode";
import type { StockMovimentType } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import { useCreateStockMoviment } from "@/modules/stockMoviment/presentation/hooks/useCreateStockMoviment";
import { useDefaultTeam } from "@/modules/teams/presentation/hooks/useDefaultTeam";

function ScannedProductCard({
	product,
	teamId,
}: {
	product: Product;
	teamId: string | null;
}) {
	const createStockMoviment = useCreateStockMoviment();

	function handleMove(type: StockMovimentType) {
		if (!teamId) return;
		createStockMoviment.mutate({
			type,
			quantity: 1,
			price: product.price,
			date: new Date().toISOString(),
			productId: product.id,
			teamId,
		});
	}

	const isMoving = createStockMoviment.isPending;

	return (
		<Card>
			<CardHeader className="border-b">
				<div className="flex items-center justify-between gap-2">
					<CardTitle className="truncate">{product.name}</CardTitle>
					<StockBadge quantity={product.quantity} minimum={product.minumum} />
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-4">
				<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
					<span>{product.category}</span>
					<span className="tabular-nums font-medium text-foreground">
						{formatCurrency(product.price)}
					</span>
					{product.isPortioned && <Badge variant="secondary">Porcionado</Badge>}
				</div>

				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							size="icon"
							className="size-12"
							onClick={() => handleMove("saída")}
							disabled={isMoving || !teamId || product.quantity === 0}
							aria-label="Registrar saída de 1 unidade"
						>
							<MinusIcon />
						</Button>
						<span className="min-w-14 text-center text-2xl font-semibold tabular-nums">
							{product.quantity}
						</span>
						<Button
							variant="outline"
							size="icon"
							className="size-12"
							onClick={() => handleMove("entrada")}
							disabled={isMoving || !teamId}
							aria-label="Registrar entrada de 1 unidade"
						>
							<PlusIcon />
						</Button>
					</div>
					<span className="text-right text-xs text-muted-foreground">
						Cada toque gera uma movimentação de entrada ou saída de 1{" "}
						{product.unity}
					</span>
				</div>

				{createStockMoviment.isError && (
					<p className="text-xs text-destructive">
						Erro ao registrar movimentação. Tente novamente.
					</p>
				)}
			</CardContent>
		</Card>
	);
}

export function BarcodeScannerPage() {
	const { defaultTeamId } = useDefaultTeam();
	const [barcode, setBarcode] = useState<string | null>(null);
	const [manualCode, setManualCode] = useState("");
	const [associateOpen, setAssociateOpen] = useState(false);

	const {
		data: product,
		isFetching,
		isError,
		isNotFound,
	} = useProductByBarcode(defaultTeamId, barcode);

	useEffect(() => {
		const code = manualCode.trim();
		if (!code) {
			setBarcode(null);
			return;
		}
		const timeout = setTimeout(() => setBarcode(code), 500);
		return () => clearTimeout(timeout);
	}, [manualCode]);

	function handleDetected(code: string) {
		setManualCode(code);
		setBarcode(code);
	}

	return (
		<div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4 sm:gap-6 sm:p-6">
			<div>
				<h1 className="text-2xl font-semibold text-foreground">
					Escanear produto
				</h1>
				<p className="mt-0.5 text-sm text-muted-foreground">
					Leia o código de barras com a câmera ou digite o código para buscar o
					produto.
				</p>
			</div>

			{!defaultTeamId && (
				<Alert variant="destructive">
					<AlertTitle>Nenhuma equipe selecionada</AlertTitle>
					<AlertDescription>
						Selecione uma equipe na tela inicial para buscar produtos.
					</AlertDescription>
				</Alert>
			)}

			<BarcodeScannerCamera onDetected={handleDetected} />

			<div className="relative">
				<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={manualCode}
					onChange={(e) => setManualCode(e.target.value)}
					placeholder="Digite o código de barras"
					inputMode="numeric"
					autoComplete="off"
					className="h-10 pl-9 font-mono"
				/>
			</div>

			{barcode && (
				<div className="flex items-center justify-between gap-2">
					<span className="text-sm text-muted-foreground">
						Código lido:{" "}
						<span className="font-mono font-medium text-foreground">
							{barcode}
						</span>
					</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setBarcode(null);
							setManualCode("");
						}}
						className="gap-1"
					>
						<XIcon className="size-3.5" />
						Limpar
					</Button>
				</div>
			)}

			{barcode && isFetching && (
				<div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
					<Loader2Icon className="size-4 animate-spin" />
					Buscando produto...
				</div>
			)}

			{barcode && !isFetching && product && (
				<ScannedProductCard product={product} teamId={defaultTeamId} />
			)}

			{barcode && !isFetching && isNotFound && (
				<Card>
					<CardContent className="flex flex-col items-center gap-3 p-6 text-center">
						<PackageSearchIcon className="size-8 text-muted-foreground" />
						<div>
							<p className="font-medium text-foreground">
								Nenhum produto encontrado
							</p>
							<p className="mt-0.5 text-sm text-muted-foreground">
								Este código de barras ainda não está associado a um produto da
								equipe.
							</p>
						</div>
						<Button onClick={() => setAssociateOpen(true)}>
							Associar a um produto
						</Button>
					</CardContent>
				</Card>
			)}

			{barcode && !isFetching && isError && !isNotFound && (
				<Alert variant="destructive">
					<AlertTitle>Erro ao buscar produto</AlertTitle>
					<AlertDescription>
						Não foi possível consultar o código de barras. Tente novamente.
					</AlertDescription>
				</Alert>
			)}

			{barcode && (
				<AssociateBarcodeSheet
					open={associateOpen}
					onOpenChange={setAssociateOpen}
					barcode={barcode}
					teamId={defaultTeamId}
				/>
			)}
		</div>
	);
}
