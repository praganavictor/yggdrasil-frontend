import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { CreateStockMovimentDto } from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import { useProducts } from "@/modules/products/presentation/hooks/useProducts";

interface StockMovimentFormSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	moviment?: StockMoviment;
	onSubmit: (dto: CreateStockMovimentDto) => void;
	isPending: boolean;
}

function toDateInputValue(isoDate: string): string {
	return isoDate ? isoDate.slice(0, 10) : "";
}

function toISODate(dateValue: string): string {
	return dateValue ? new Date(dateValue).toISOString() : "";
}

const emptyForm: CreateStockMovimentDto = {
	type: "entrada",
	quantity: 0,
	price: 0,
	date: new Date().toISOString(),
	productId: "",
};

export function StockMovimentFormSheet({
	open,
	onOpenChange,
	moviment,
	onSubmit,
	isPending,
}: StockMovimentFormSheetProps) {
	const { data: products = [] } = useProducts();
	const [form, setForm] = useState<CreateStockMovimentDto>(emptyForm);

	useEffect(() => {
		if (moviment) {
			setForm({
				type: moviment.type,
				quantity: moviment.quantity,
				price: moviment.price,
				date: moviment.date,
				productId: moviment.productId,
			});
		} else {
			setForm(emptyForm);
		}
	}, [moviment, open]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		onSubmit(form);
	}

	const title = moviment ? "Editar Movimentação" : "Nova Movimentação";

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="productId">Produto</Label>
						<Select
							value={form.productId}
							onValueChange={(value) =>
								setForm((prev) => ({ ...prev, productId: value }))
							}
							required
						>
							<SelectTrigger id="productId">
								<SelectValue placeholder="Selecione um produto" />
							</SelectTrigger>
							<SelectContent>
								{products.map((product) => (
									<SelectItem key={product.id} value={product.id}>
										{product.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="type">Tipo</Label>
						<Select
							value={form.type}
							onValueChange={(value) =>
								setForm((prev) => ({
									...prev,
									type: value as "entrada" | "saida",
								}))
							}
						>
							<SelectTrigger id="type">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="entrada">Entrada</SelectItem>
								<SelectItem value="saida">Saída</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="date">Data</Label>
						<Input
							id="date"
							type="date"
							value={toDateInputValue(form.date)}
							onChange={(e) =>
								setForm((prev) => ({
									...prev,
									date: toISODate(e.target.value),
								}))
							}
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="quantity">Quantidade</Label>
							<Input
								id="quantity"
								type="number"
								min={1}
								value={form.quantity}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										quantity: Number(e.target.value),
									}))
								}
								required
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label htmlFor="price">Preço unitário (R$)</Label>
							<Input
								id="price"
								type="number"
								min={0}
								step={0.01}
								value={form.price}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										price: Number(e.target.value),
									}))
								}
								required
							/>
						</div>
					</div>

					{form.quantity > 0 && form.price > 0 && (
						<p className="text-sm text-muted-foreground">
							Total:{" "}
							<span className="font-medium text-foreground">
								{new Intl.NumberFormat("pt-BR", {
									style: "currency",
									currency: "BRL",
								}).format(form.quantity * form.price)}
							</span>
						</p>
					)}

					<SheetFooter className="mt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isPending || !form.productId}>
							{isPending ? "Salvando..." : "Salvar"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
