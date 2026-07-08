import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { Product } from "@/modules/products/domain/entities/Product";
import { StockBadge } from "@/modules/products/presentation/components/StockBadge";
import { useProducts } from "@/modules/products/presentation/hooks/useProducts";
import { useUpdateProduct } from "@/modules/products/presentation/hooks/useUpdateProduct";
import { useIsMobile } from "@/shared/hooks/useIsMobile";

interface AssociateBarcodeSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	barcode: string;
	teamId: string | null;
}

export function AssociateBarcodeSheet({
	open,
	onOpenChange,
	barcode,
	teamId,
}: AssociateBarcodeSheetProps) {
	const isMobile = useIsMobile();
	const [search, setSearch] = useState("");
	const { data: productsResult, isLoading } = useProducts(
		open ? teamId : null,
		{ limit: 1000 },
	);
	const updateProduct = useUpdateProduct();

	const products = productsResult?.data ?? [];
	const filtered = search.trim()
		? products.filter((p) =>
				p.name.toLowerCase().includes(search.trim().toLowerCase()),
			)
		: products;

	function handleSelect(product: Product) {
		updateProduct.mutate(
			{ id: product.id, dto: { barcode } },
			{
				onSuccess: () => {
					onOpenChange(false);
					setSearch("");
				},
			},
		);
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side={isMobile ? "bottom" : "right"}
				className="data-[side=bottom]:max-h-[85dvh] data-[side=bottom]:rounded-t-2xl"
			>
				<SheetHeader className="border-b">
					<SheetTitle>Associar código de barras</SheetTitle>
					<SheetDescription>
						Escolha o produto que receberá o código{" "}
						<span className="font-mono font-medium text-foreground">
							{barcode}
						</span>
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col gap-3 overflow-y-auto p-4">
					<div className="relative">
						<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Buscar produto pelo nome"
							className="pl-9"
						/>
					</div>

					{updateProduct.isError && (
						<p className="text-xs text-destructive">
							Erro ao associar o código de barras. Verifique se este código já
							não está em uso por outro produto.
						</p>
					)}

					{isLoading ? (
						<p className="py-8 text-center text-sm text-muted-foreground">
							Carregando produtos...
						</p>
					) : filtered.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted-foreground">
							Nenhum produto encontrado.
						</p>
					) : (
						<div className="flex flex-col divide-y rounded-lg border">
							{filtered.map((product) => (
								<button
									key={product.id}
									type="button"
									onClick={() => handleSelect(product)}
									disabled={updateProduct.isPending}
									className="flex items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-accent disabled:opacity-50 first:rounded-t-lg last:rounded-b-lg"
								>
									<div className="flex min-w-0 flex-col gap-0.5">
										<span className="truncate text-sm font-medium text-foreground">
											{product.name}
										</span>
										<span className="truncate text-xs text-muted-foreground">
											{product.category}
											{product.barcode && (
												<>
													{" "}
													· código atual:{" "}
													<span className="font-mono">{product.barcode}</span>
												</>
											)}
										</span>
									</div>
									<StockBadge
										quantity={product.quantity}
										minimum={product.minumum}
									/>
								</button>
							))}
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
