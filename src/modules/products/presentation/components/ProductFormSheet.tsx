import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
};

export function ProductFormSheet({
	open,
	onOpenChange,
	product,
	onSubmit,
	isPending,
}: ProductFormSheetProps) {
	const [form, setForm] = useState<CreateProductDto>(emptyForm);

	useEffect(() => {
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
			});
		} else {
			setForm(emptyForm);
		}
	}, [product, open]);

	function handleChange(
		field: keyof CreateProductDto,
		value: string | number,
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
						<Label htmlFor="name">Nome</Label>
						<Input
							id="name"
							value={form.name}
							onChange={(e) => handleChange("name", e.target.value)}
							placeholder="Nome do produto"
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="description">Descrição</Label>
						<Textarea
							id="description"
							value={form.description}
							onChange={(e) => handleChange("description", e.target.value)}
							placeholder="Descrição do produto"
							rows={3}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="local">Local</Label>
						<Input
							id="local"
							value={form.local}
							onChange={(e) => handleChange("local", e.target.value)}
							placeholder="Ex: Depósito A - Prateleira 3"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="category">Categoria</Label>
							<Input
								id="category"
								value={form.category}
								onChange={(e) => handleChange("category", e.target.value)}
								placeholder="Ex: Móveis"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label htmlFor="subcategory">Subcategoria</Label>
							<Input
								id="subcategory"
								value={form.subcategory}
								onChange={(e) => handleChange("subcategory", e.target.value)}
								placeholder="Ex: Cadeiras"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="unity">Unidade</Label>
						<Input
							id="unity"
							value={form.unity}
							onChange={(e) => handleChange("unity", e.target.value)}
							placeholder="Ex: unidade, caixa, kg"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="quantity">Quantidade</Label>
							<Input
								id="quantity"
								type="number"
								min={0}
								value={form.quantity}
								onChange={(e) =>
									handleChange("quantity", Number(e.target.value))
								}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label htmlFor="minumum">Quantidade Mínima</Label>
							<Input
								id="minumum"
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
						<Label htmlFor="price">Preço (R$)</Label>
						<Input
							id="price"
							type="number"
							min={0}
							step={0.01}
							value={form.price}
							onChange={(e) => handleChange("price", Number(e.target.value))}
						/>
					</div>

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
