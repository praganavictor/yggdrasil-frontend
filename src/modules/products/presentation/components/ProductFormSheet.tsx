import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { CreateProductDto } from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";

interface ProductFormSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: Product;
	onSubmit: (dto: CreateProductDto) => void;
	isPending: boolean;
	errorMessage?: string;
}

const emptyForm: CreateProductDto = {
	name: "",
	description: "",
	local: "",
	category: "",
	subcategory: "",
	unity: "",
	quantity: 0,
	minumum: 0,
	price: 0,
	isPortioned: false,
};

export function ProductFormSheet({
	open,
	onOpenChange,
	product,
	onSubmit,
	isPending,
	errorMessage,
}: ProductFormSheetProps) {
	const fieldId = useId();
	const [form, setForm] = useState<CreateProductDto>(emptyForm);

	useEffect(() => {
		if (!open) return;
		if (product) {
			setForm({
				name: product.name,
				description: product.description,
				local: product.local,
				category: product.category,
				subcategory: product.subcategory,
				unity: product.unity,
				quantity: product.quantity,
				minumum: product.minumum,
				price: product.price,
				isPortioned: product.isPortioned,
			});
		} else {
			setForm(emptyForm);
		}
	}, [product, open]);

	function handleChange(
		field: keyof CreateProductDto,
		value: string | number | boolean,
	) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		onSubmit(form);
	}

	const title = product ? "Editar Produto" : "Novo Produto";

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor={`${fieldId}-name`}>Nome</Label>
						<Input
							id={`${fieldId}-name`}
							value={form.name}
							onChange={(e) => handleChange("name", e.target.value)}
							placeholder="Nome do produto"
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor={`${fieldId}-description`}>Descrição</Label>
						<Textarea
							id={`${fieldId}-description`}
							value={form.description}
							onChange={(e) => handleChange("description", e.target.value)}
							placeholder="Descrição do produto"
							rows={3}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor={`${fieldId}-local`}>Local</Label>
						<Input
							id={`${fieldId}-local`}
							value={form.local}
							onChange={(e) => handleChange("local", e.target.value)}
							placeholder="Ex: Depósito A - Prateleira 3"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor={`${fieldId}-category`}>Categoria</Label>
							<Input
								id={`${fieldId}-category`}
								value={form.category}
								onChange={(e) => handleChange("category", e.target.value)}
								placeholder="Ex: Móveis"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label htmlFor={`${fieldId}-subcategory`}>Subcategoria</Label>
							<Input
								id={`${fieldId}-subcategory`}
								value={form.subcategory}
								onChange={(e) => handleChange("subcategory", e.target.value)}
								placeholder="Ex: Cadeiras"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor={`${fieldId}-unity`}>Unidade</Label>
						<Input
							id={`${fieldId}-unity`}
							value={form.unity}
							onChange={(e) => handleChange("unity", e.target.value)}
							placeholder="Ex: unidade, caixa, kg"
						/>
					</div>

					<div className="flex items-center gap-2">
						<Checkbox
							id={`${fieldId}-isPortioned`}
							checked={form.isPortioned}
							onCheckedChange={(checked) =>
								handleChange("isPortioned", checked === true)
							}
						/>
						<Label htmlFor={`${fieldId}-isPortioned`} className="font-normal">
							Produto porcionado
						</Label>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor={`${fieldId}-quantity`}>Quantidade</Label>
							<Input
								id={`${fieldId}-quantity`}
								type="number"
								min={0}
								value={form.quantity}
								onChange={(e) =>
									handleChange("quantity", Number(e.target.value))
								}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label htmlFor={`${fieldId}-minumum`}>Quantidade Mínima</Label>
							<Input
								id={`${fieldId}-minumum`}
								type="number"
								min={0}
								value={form.minumum}
								onChange={(e) =>
									handleChange("minumum", Number(e.target.value))
								}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor={`${fieldId}-price`}>Preço (R$)</Label>
						<Input
							id={`${fieldId}-price`}
							type="number"
							min={0}
							step={0.01}
							value={form.price}
							onChange={(e) => handleChange("price", Number(e.target.value))}
						/>
					</div>

					{errorMessage && (
						<p className="text-xs text-destructive">{errorMessage}</p>
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
						<Button type="submit" disabled={isPending}>
							{isPending ? "Salvando..." : "Salvar"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
