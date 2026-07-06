import { Link } from "@tanstack/react-router";
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { CreateProductDto } from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import { DeleteProductDialog } from "@/modules/products/presentation/components/DeleteProductDialog";
import { ProductDetailsSheet } from "@/modules/products/presentation/components/ProductDetailsSheet";
import { ProductFormSheet } from "@/modules/products/presentation/components/ProductFormSheet";
import { StockBadge } from "@/modules/products/presentation/components/StockBadge";
import { useCreateProduct } from "@/modules/products/presentation/hooks/useCreateProduct";
import { useDeleteProduct } from "@/modules/products/presentation/hooks/useDeleteProduct";
import { useProducts } from "@/modules/products/presentation/hooks/useProducts";
import { useUpdateProduct } from "@/modules/products/presentation/hooks/useUpdateProduct";
import { useDefaultTeam } from "@/modules/teams/presentation/hooks/useDefaultTeam";
import { useTeams } from "@/modules/teams/presentation/hooks/useTeams";

export function ProductsPage() {
	const { defaultTeamId } = useDefaultTeam();
	const hasDefault = defaultTeamId !== null;

	const { data: teams = [] } = useTeams();
	const [manualTeamId, setManualTeamId] = useState<string | null>(null);

	const selectedTeamId = hasDefault ? defaultTeamId : manualTeamId;

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [categoryInput, setCategoryInput] = useState("");
	const [category, setCategory] = useState("");
	const [onlyPortioned, setOnlyPortioned] = useState(false);
	const [onlyBelowMinimum, setOnlyBelowMinimum] = useState(false);
	const [onlyOutOfStock, setOnlyOutOfStock] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setCategory(categoryInput.trim()), 400);
		return () => clearTimeout(timeout);
	}, [categoryInput]);

	useEffect(() => {
		setPage(1);
	}, [
		selectedTeamId,
		category,
		onlyPortioned,
		onlyBelowMinimum,
		onlyOutOfStock,
	]);

	function handleBelowMinimumChange(checked: boolean) {
		setOnlyBelowMinimum(checked);
		if (checked) setOnlyOutOfStock(false);
	}

	function handleOutOfStockChange(checked: boolean) {
		setOnlyOutOfStock(checked);
		if (checked) setOnlyBelowMinimum(false);
	}

	const {
		data: result,
		isLoading,
		isError,
	} = useProducts(selectedTeamId, {
		page,
		limit,
		category: category || undefined,
		isPortioned: onlyPortioned ? true : undefined,
		belowMinimum: onlyBelowMinimum ? true : undefined,
		outOfStock: onlyOutOfStock ? true : undefined,
	});
	const products = result?.data ?? [];
	const meta = result?.meta;
	const createProduct = useCreateProduct();
	const updateProduct = useUpdateProduct();
	const deleteProduct = useDeleteProduct();

	const [formOpen, setFormOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | undefined>(
		undefined,
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

	const currentViewingProduct = viewingProduct
		? (products.find((p) => p.id === viewingProduct.id) ?? viewingProduct)
		: null;

	function handleViewProduct(product: Product) {
		setViewingProduct(product);
		setDetailsOpen(true);
	}

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
		if (!selectedTeamId) return;
		if (editingProduct) {
			updateProduct.mutate(
				{ id: editingProduct.id, dto },
				{ onSuccess: () => setFormOpen(false) },
			);
		} else {
			createProduct.mutate(
				{ teamId: selectedTeamId, dto },
				{ onSuccess: () => setFormOpen(false) },
			);
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
		<div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Produtos</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Gerencie o estoque de produtos
					</p>
				</div>
				<Button
					onClick={handleNewProduct}
					disabled={!selectedTeamId}
					className="w-full sm:w-auto"
				>
					<PlusIcon />
					Novo produto
				</Button>
			</div>

			{!hasDefault && (
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
					<span className="text-sm font-medium text-foreground shrink-0">
						Equipe:
					</span>
					<Select
						value={manualTeamId ?? ""}
						onValueChange={(v) => setManualTeamId(v || null)}
					>
						<SelectTrigger className="w-full sm:w-64">
							<SelectValue placeholder="Selecione uma equipe" />
						</SelectTrigger>
						<SelectContent>
							{teams.map((team) => (
								<SelectItem key={team.id} value={team.id}>
									{team.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Link
						to="/configuracoes"
						className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
					>
						Definir equipe padrão
					</Link>
				</div>
			)}

			{selectedTeamId && (
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
						<span className="text-sm font-medium text-foreground shrink-0">
							Categoria:
						</span>
						<Input
							value={categoryInput}
							onChange={(e) => setCategoryInput(e.target.value)}
							placeholder="Filtrar por categoria"
							className="w-full sm:w-64"
						/>
					</div>

					<div className="flex items-center gap-2">
						<Switch
							id="only-portioned"
							checked={onlyPortioned}
							onCheckedChange={setOnlyPortioned}
						/>
						<Label htmlFor="only-portioned" className="font-normal">
							Somente porcionados
						</Label>
					</div>

					<div className="flex items-center gap-2">
						<Switch
							id="only-below-minimum"
							checked={onlyBelowMinimum}
							onCheckedChange={handleBelowMinimumChange}
						/>
						<Label htmlFor="only-below-minimum" className="font-normal">
							Abaixo do mínimo
						</Label>
					</div>

					<div className="flex items-center gap-2">
						<Switch
							id="only-out-of-stock"
							checked={onlyOutOfStock}
							onCheckedChange={handleOutOfStockChange}
						/>
						<Label htmlFor="only-out-of-stock" className="font-normal">
							Sem estoque
						</Label>
					</div>
				</div>
			)}

			<Card>
				<CardHeader className="border-b">
					<CardTitle>Lista de produtos</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{!selectedTeamId && (
						<div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
							Selecione uma equipe para ver os produtos.
						</div>
					)}

					{selectedTeamId && isLoading && (
						<div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
							Carregando produtos...
						</div>
					)}

					{selectedTeamId && isError && (
						<div className="flex items-center justify-center py-12 text-destructive text-sm">
							Erro ao carregar produtos. Tente novamente.
						</div>
					)}

					{selectedTeamId &&
						!isLoading &&
						!isError &&
						products.length === 0 && (
							<div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
								<p className="text-sm">Nenhum produto cadastrado.</p>
								<Button variant="outline" size="sm" onClick={handleNewProduct}>
									<PlusIcon />
									Cadastrar primeiro produto
								</Button>
							</div>
						)}

					{selectedTeamId && !isLoading && !isError && products.length > 0 && (
						<div className="flex flex-col divide-y md:hidden">
							{products.map((product) => (
								<div key={product.id} className="flex items-center gap-2 p-4">
									<button
										type="button"
										onClick={() => handleViewProduct(product)}
										className="flex min-w-0 flex-1 flex-col gap-1.5 text-left"
									>
										<div className="flex items-start justify-between gap-2">
											<span className="min-w-0 truncate font-medium text-foreground">
												{product.name}
											</span>
											<StockBadge
												quantity={product.quantity}
												minimum={product.minumum}
											/>
										</div>
										<span className="truncate text-xs text-muted-foreground">
											{product.category}
											{product.subcategory && ` · ${product.subcategory}`}
											{product.local && ` · ${product.local}`}
										</span>
										<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
											<span className="tabular-nums">
												{product.quantity} {product.unity}
											</span>
											<span className="tabular-nums text-muted-foreground">
												{formatCurrency(product.price)}
											</span>
											{product.isPortioned && (
												<Badge variant="secondary">Porcionado</Badge>
											)}
										</div>
									</button>
									<div className="flex shrink-0 flex-col items-center gap-1">
										<Button
											variant="ghost"
											size="icon"
											className="size-9"
											onClick={() => handleEditProduct(product)}
											aria-label="Editar produto"
										>
											<PencilIcon />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="size-9 text-destructive hover:text-destructive"
											onClick={() => handleDeleteProduct(product)}
											aria-label="Excluir produto"
										>
											<TrashIcon />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}

					{selectedTeamId && !isLoading && !isError && products.length > 0 && (
						<div className="hidden md:block">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nome</TableHead>
										<TableHead>Categoria</TableHead>
										<TableHead>Subcategoria</TableHead>
										<TableHead>Local</TableHead>
										<TableHead>Unidade</TableHead>
										<TableHead>Porcionado</TableHead>
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
											<TableCell>
												{product.isPortioned ? (
													<Badge variant="secondary">Sim</Badge>
												) : (
													<span className="text-muted-foreground">Não</span>
												)}
											</TableCell>
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
														onClick={() => handleViewProduct(product)}
														aria-label="Visualizar produto"
													>
														<EyeIcon />
													</Button>
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
						</div>
					)}
				</CardContent>
				{selectedTeamId && meta && (
					<PaginationControls
						page={meta.page}
						totalPages={meta.totalPages}
						total={meta.total}
						limit={limit}
						onPageChange={setPage}
						onLimitChange={(newLimit) => {
							setLimit(newLimit);
							setPage(1);
						}}
					/>
				)}
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

			<ProductDetailsSheet
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
				product={currentViewingProduct}
				teamId={selectedTeamId}
			/>
		</div>
	);
}
