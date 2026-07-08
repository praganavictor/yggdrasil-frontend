import {
	CheckIcon,
	Link2Icon,
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
	const [baseline, setBaseline] = useState(product.quantity);
	const [quantityInput, setQuantityInput] = useState(String(product.quantity));

	useEffect(() => {
		setBaseline(product.quantity);
		setQuantityInput(String(product.quantity));
	}, [product.quantity]);

	function handleMove(type: StockMovimentType, quantity: number) {
		if (!teamId || quantity <= 0) return;
		const target =
			type === "entrada" ? baseline + quantity : baseline - quantity;
		createStockMoviment.mutate(
			{
				type,
				quantity,
				price: product.price,
				date: new Date().toISOString(),
				productId: product.id,
				teamId,
			},
			{
				onSuccess: () => setBaseline(target),
				onError: () => setQuantityInput(String(baseline)),
			},
		);
	}

	function handleQuantityBlur() {
		if (Number.isNaN(Number.parseInt(quantityInput, 10))) {
			setQuantityInput(String(baseline));
		}
	}

	const isMoving = createStockMoviment.isPending;
	const parsedInput = Number.parseInt(quantityInput, 10);
	const currentValue = Number.isNaN(parsedInput) ? baseline : parsedInput;
	const pendingDiff = currentValue - baseline;
	const hasPending = pendingDiff !== 0;

	function adjustQuantity(delta: number) {
		setQuantityInput(String(Math.max(0, currentValue + delta)));
	}

	return (
		<Card>
			<CardHeader className="border-b">
				<div className="flex items-center justify-between gap-2">
					<CardTitle className="truncate">{product.name}</CardTitle>
					<StockBadge quantity={baseline} minimum={product.minumum} />
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-4">
				<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
					<span>
						Estoque atual:{" "}
						<span className="tabular-nums font-medium text-foreground">
							{baseline} {product.unity}
						</span>
					</span>
					{product.isPortioned && <Badge variant="secondary">Porcionado</Badge>}
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-center gap-2">
						<Button
							variant="outline"
							size="icon"
							className="size-11 text-sm font-semibold"
							onClick={() => adjustQuantity(-5)}
							disabled={isMoving || !teamId || currentValue === 0}
							aria-label="Diminuir 5 unidades"
						>
							-5
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="size-11"
							onClick={() => adjustQuantity(-1)}
							disabled={isMoving || !teamId || currentValue === 0}
							aria-label="Diminuir 1 unidade"
						>
							<MinusIcon />
						</Button>
						<Input
							value={quantityInput}
							onChange={(e) =>
								setQuantityInput(e.target.value.replace(/\D/g, ""))
							}
							onFocus={(e) => e.target.select()}
							onBlur={handleQuantityBlur}
							onKeyDown={(e) => {
								if (e.key === "Enter") e.currentTarget.blur();
							}}
							disabled={isMoving || !teamId}
							inputMode="numeric"
							autoComplete="off"
							aria-label="Quantidade em estoque"
							className="h-11 w-20 text-center text-xl font-semibold tabular-nums"
						/>
						<Button
							variant="outline"
							size="icon"
							className="size-11"
							onClick={() => adjustQuantity(1)}
							disabled={isMoving || !teamId}
							aria-label="Aumentar 1 unidade"
						>
							<PlusIcon />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="size-11 text-sm font-semibold"
							onClick={() => adjustQuantity(5)}
							disabled={isMoving || !teamId}
							aria-label="Aumentar 5 unidades"
						>
							+5
						</Button>
					</div>

					{hasPending ? (
						<div className="flex flex-col gap-1">
							<Button
								onClick={() =>
									handleMove(
										pendingDiff > 0 ? "entrada" : "saída",
										Math.abs(pendingDiff),
									)
								}
								disabled={isMoving || !teamId}
								className="w-full gap-2"
							>
								<CheckIcon className="size-4" />
								{pendingDiff > 0 ? "Adicionar" : "Retirar"}{" "}
								{Math.abs(pendingDiff)} {product.unity}{" "}
								{pendingDiff > 0 ? "ao" : "do"} estoque
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setQuantityInput(String(baseline))}
								disabled={isMoving}
								className="w-full"
							>
								Cancelar
							</Button>
						</div>
					) : (
						<p className="text-center text-xs text-muted-foreground">
							Ajuste a quantidade com os botões ou digite o valor final. Nada é
							registrado até você confirmar.
						</p>
					)}
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
		isLoading,
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
				<div className="flex flex-wrap items-center justify-between gap-2">
					<span className="text-sm text-muted-foreground">
						Código lido:{" "}
						<span className="font-mono font-medium text-foreground">
							{barcode}
						</span>
					</span>
					<div className="flex items-center gap-1">
						{product && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setAssociateOpen(true)}
								className="gap-1"
							>
								<Link2Icon className="size-3.5" />
								Associar a outro
							</Button>
						)}
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
				</div>
			)}

			{barcode && isLoading && (
				<div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
					<Loader2Icon className="size-4 animate-spin" />
					Buscando produto...
				</div>
			)}

			{barcode && product && (
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

			{barcode && !isFetching && isError && !isNotFound && !product && (
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
					currentProductId={product?.id}
				/>
			)}
		</div>
	);
}
