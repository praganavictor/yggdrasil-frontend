import { MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/modules/products/domain/entities/Product";
import { StockBadge } from "@/modules/products/presentation/components/StockBadge";
import type { StockMovimentType } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import { useCreateStockMoviment } from "@/modules/stockMoviment/presentation/hooks/useCreateStockMoviment";
import { useIsMobile } from "@/shared/hooks/useIsMobile";

interface ProductDetailsSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: Product | null;
	teamId: string | null;
}

function formatDate(value?: string) {
	if (!value) return null;
	return new Date(value).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

function DetailItem({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-xs text-muted-foreground">{label}</span>
			<span className="text-sm text-foreground">{children}</span>
		</div>
	);
}

export function ProductDetailsSheet({
	open,
	onOpenChange,
	product,
	teamId,
}: ProductDetailsSheetProps) {
	const isMobile = useIsMobile();
	const createStockMoviment = useCreateStockMoviment();

	if (!product) return null;

	const createdAt = formatDate(product.createdAt);
	const updatedAt = formatDate(product.updatedAt);

	function handleMove(type: StockMovimentType) {
		if (!product || !teamId) return;
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
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side={isMobile ? "bottom" : "right"}
				className="data-[side=bottom]:max-h-[85dvh] data-[side=bottom]:rounded-t-2xl"
			>
				<SheetHeader className="border-b">
					<SheetTitle className="pr-8">{product.name}</SheetTitle>
					{product.description && (
						<SheetDescription>{product.description}</SheetDescription>
					)}
				</SheetHeader>

				<div className="flex flex-col gap-6 overflow-y-auto p-4">
					<div className="flex flex-wrap items-center gap-2">
						<StockBadge quantity={product.quantity} minimum={product.minumum} />
						{product.isPortioned && (
							<Badge variant="secondary">Porcionado</Badge>
						)}
					</div>

					<div className="grid grid-cols-2 gap-x-4 gap-y-4">
						<DetailItem label="Categoria">{product.category}</DetailItem>
						<DetailItem label="Subcategoria">{product.subcategory}</DetailItem>
						<DetailItem label="Local">{product.local}</DetailItem>
						<DetailItem label="Unidade">{product.unity}</DetailItem>
						<DetailItem label="Quantidade mínima">
							<span className="tabular-nums">{product.minumum}</span>
						</DetailItem>
						<DetailItem label="Preço">
							<span className="tabular-nums font-medium">
								{formatCurrency(product.price)}
							</span>
						</DetailItem>
					</div>

					<div className="flex flex-col gap-2 border-t pt-4">
						<span className="text-xs text-muted-foreground">Estoque atual</span>
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<Button
									variant="outline"
									size="icon"
									className="size-10 sm:size-8"
									onClick={() => handleMove("saída")}
									disabled={isMoving || !teamId || product.quantity === 0}
									aria-label="Registrar saída de 1 unidade"
								>
									<MinusIcon />
								</Button>
								<span className="min-w-12 text-center text-lg font-semibold tabular-nums">
									{product.quantity}
								</span>
								<Button
									variant="outline"
									size="icon"
									className="size-10 sm:size-8"
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
					</div>

					{(createdAt || updatedAt) && (
						<div className="grid grid-cols-2 gap-x-4 gap-y-4 border-t pt-4">
							{createdAt && (
								<DetailItem label="Cadastrado em">{createdAt}</DetailItem>
							)}
							{updatedAt && (
								<DetailItem label="Atualizado em">{updatedAt}</DetailItem>
							)}
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
