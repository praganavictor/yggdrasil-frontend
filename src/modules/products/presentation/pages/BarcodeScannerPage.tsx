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
import type { CreateProductDto } from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import { AssociateBarcodeSheet } from "@/modules/products/presentation/components/AssociateBarcodeSheet";
import { BarcodeScannerCamera } from "@/modules/products/presentation/components/BarcodeScannerCamera";
import { ProductFormSheet } from "@/modules/products/presentation/components/ProductFormSheet";
import { StockBadge } from "@/modules/products/presentation/components/StockBadge";
import { useCreateProduct } from "@/modules/products/presentation/hooks/useCreateProduct";
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
	const [quantityInput, setQuantityInput] = useState("0");
	const [direction, setDirection] = useState<StockMovimentType | null>(null);

	useEffect(() => {
		setBaseline(product.quantity);
		setQuantityInput("0");
		setDirection(null);
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
				onSuccess: () => {
					setBaseline(target);
					setQuantityInput("0");
					setDirection(null);
				},
				onError: () => {
					setQuantityInput("0");
					setDirection(null);
				},
			},
		);
	}

	function handleQuantityBlur() {
		if (Number.isNaN(Number.parseInt(quantityInput, 10))) {
			setQuantityInput("0");
		}
	}

	const isMoving = createStockMoviment.isPending;
	const parsedInput = Number.parseInt(quantityInput, 10);
	const amount = Number.isNaN(parsedInput) ? 0 : parsedInput;
	const exceedsStock = direction === "saída" && amount > baseline;
	const hasPending = direction !== null && amount > 0;

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
							variant={direction === "saída" ? "default" : "outline"}
							size="icon"
							className="size-11"
							onClick={() => setDirection("saída")}
							disabled={isMoving || !teamId}
							aria-label="Retirar do estoque"
							aria-pressed={direction === "saída"}
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
							aria-label="Quantidade a movimentar"
							className="h-11 w-20 text-center text-xl font-semibold tabular-nums"
						/>
						<Button
							variant={direction === "entrada" ? "default" : "outline"}
							size="icon"
							className="size-11"
							onClick={() => setDirection("entrada")}
							disabled={isMoving || !teamId}
							aria-label="Adicionar ao estoque"
							aria-pressed={direction === "entrada"}
						>
							<PlusIcon />
						</Button>
					</div>

					{hasPending ? (
						<div className="flex flex-col gap-1">
							<Button
								onClick={() => direction && handleMove(direction, amount)}
								disabled={isMoving || !teamId || exceedsStock}
								className="w-full gap-2"
							>
								<CheckIcon className="size-4" />
								{direction === "entrada" ? "Adicionar" : "Retirar"} {amount}{" "}
								{product.unity} {direction === "entrada" ? "ao" : "do"} estoque
							</Button>
							{exceedsStock && (
								<p className="text-center text-xs text-destructive">
									Quantidade maior que o estoque atual ({baseline}{" "}
									{product.unity}).
								</p>
							)}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setQuantityInput("0");
									setDirection(null);
								}}
								disabled={isMoving}
								className="w-full"
							>
								Cancelar
							</Button>
						</div>
					) : (
						<p className="text-center text-xs text-muted-foreground">
							Digite a quantidade e toque em − para retirar ou + para adicionar.
							Nada é registrado até você confirmar.
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
	const [createOpen, setCreateOpen] = useState(false);
	const createProduct = useCreateProduct();

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

	async function handleCreate(dto: CreateProductDto) {
		if (!defaultTeamId || !barcode) return;
		try {
			await createProduct.mutateAsync({
				teamId: defaultTeamId,
				dto: { ...dto, barcode },
			});
			setCreateOpen(false);
		} catch {
			// createProduct.isError exibe a mensagem de erro no formulário
		}
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
						<div className="flex w-full flex-col gap-2">
							<Button
								onClick={() => setCreateOpen(true)}
								className="w-full gap-2"
							>
								<PlusIcon className="size-4" />
								Cadastrar novo produto
							</Button>
							<Button
								variant="outline"
								onClick={() => setAssociateOpen(true)}
								className="w-full gap-2"
							>
								<Link2Icon className="size-4" />
								Associar a um produto existente
							</Button>
						</div>
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

			<ProductFormSheet
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSubmit={handleCreate}
				isPending={createProduct.isPending}
				errorMessage={
					createProduct.isError
						? "Erro ao cadastrar o produto. Tente novamente."
						: undefined
				}
			/>
		</div>
	);
}
