import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CreateProductDto } from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import { DeleteProductDialog } from "@/modules/products/presentation/components/DeleteProductDialog";
import { ProductFormSheet } from "@/modules/products/presentation/components/ProductFormSheet";
import { useCreateProduct } from "@/modules/products/presentation/hooks/useCreateProduct";
import { useDeleteProduct } from "@/modules/products/presentation/hooks/useDeleteProduct";
import { useProducts } from "@/modules/products/presentation/hooks/useProducts";
import { useUpdateProduct } from "@/modules/products/presentation/hooks/useUpdateProduct";

function formatCurrency(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

function StockBadge({ quantity, minimum }: { quantity: number; minimum: number }) {
	if (quantity === 0) {
		return <Badge variant="destructive">Sem estoque</Badge>;
	}
	if (quantity <= minimum) {
		return <Badge variant="warning">Estoque baixo</Badge>;
	}
	return <Badge variant="success">Em estoque</Badge>;
}

export function ProductsPage() {
	const { data: products = [], isLoading, isError } = useProducts();
	const createProduct = useCreateProduct();
	const updateProduct = useUpdateProduct();
	const deleteProduct = useDeleteProduct();

	const [formOpen, setFormOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

	function handleNewProduct() {
		setEditingProduct(undefined);
		setFormOpen(true);
	}

	function handleEditProduct(product: Product) {
		setEditingProduct(product);
		setFormOpen(true);
	}

	function handleDeleteProduct(product: Product) {
		setDeletingProduct(product);
		setDeleteDialogOpen(true);
	}

	function handleFormSubmit(dto: CreateProductDto) {
		if (editingProduct) {
			updateProduct.mutate(
				{ id: editingProduct.id, dto },
				{ onSuccess: () => setFormOpen(false) },
			);
		} else {
			createProduct.mutate(dto, { onSuccess: () => setFormOpen(false) });
		}
	}

	function handleDeleteConfirm() {
		if (!deletingProduct) return;
		deleteProduct.mutate(deletingProduct.id, {
			onSuccess: () => {
				setDeleteDialogOpen(false);
				setDeletingProduct(null);
			},
		});
	}

	const isPendingForm = createProduct.isPending || updateProduct.isPending;

	return (
		<div className="p-6 flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Produtos</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Gerencie o estoque de produtos
					</p>
				</div>
				<Button onClick={handleNewProduct}>
					<PlusIcon />
					Novo produto
				</Button>
			</div>

			<Card>
				<CardHeader className="border-b">
					<CardTitle>Lista de produtos</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading && (
						<div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
							Carregando produtos...
						</div>
					)}

					{isError && (
						<div className="flex items-center justify-center py-12 text-destructive text-sm">
							Erro ao carregar produtos. Tente novamente.
						</div>
					)}

					{!isLoading && !isError && products.length === 0 && (
						<div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
							<p className="text-sm">Nenhum produto cadastrado.</p>
							<Button variant="outline" size="sm" onClick={handleNewProduct}>
								<PlusIcon />
								Cadastrar primeiro produto
							</Button>
						</div>
					)}

					{!isLoading && !isError && products.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nome</TableHead>
									<TableHead>Categoria</TableHead>
									<TableHead>Subcategoria</TableHead>
									<TableHead>Local</TableHead>
									<TableHead>Unidade</TableHead>
									<TableHead className="text-right">Qtd.</TableHead>
									<TableHead className="text-right">Mín.</TableHead>
									<TableHead className="text-right">Preço</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-24">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{products.map((product) => (
									<TableRow key={product.id}>
										<TableCell className="font-medium max-w-[180px] truncate">
											{product.name}
										</TableCell>
										<TableCell>{product.category}</TableCell>
										<TableCell>{product.subcategory}</TableCell>
										<TableCell className="text-muted-foreground">
											{product.local}
										</TableCell>
										<TableCell>{product.unity}</TableCell>
										<TableCell className="text-right tabular-nums">
											{product.quantity}
										</TableCell>
										<TableCell className="text-right tabular-nums text-muted-foreground">
											{product.minumum}
										</TableCell>
										<TableCell className="text-right tabular-nums">
											{formatCurrency(product.price)}
										</TableCell>
										<TableCell>
											<StockBadge
												quantity={product.quantity}
												minimum={product.minumum}
											/>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<Button
													variant="ghost"
													size="icon-sm"
													onClick={() => handleEditProduct(product)}
													aria-label="Editar produto"
												>
													<PencilIcon />
												</Button>
												<Button
													variant="ghost"
													size="icon-sm"
													className="text-destructive hover:text-destructive"
													onClick={() => handleDeleteProduct(product)}
													aria-label="Excluir produto"
												>
													<TrashIcon />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<ProductFormSheet
				open={formOpen}
				onOpenChange={setFormOpen}
				product={editingProduct}
				onSubmit={handleFormSubmit}
				isPending={isPendingForm}
			/>

			<DeleteProductDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				product={deletingProduct}
				onConfirm={handleDeleteConfirm}
				isPending={deleteProduct.isPending}
			/>
		</div>
	);
}
