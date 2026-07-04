import { Link } from "@tanstack/react-router";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
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
import type { CreateProductDto } from "@/modules/products/application/dtos/ProductDto";
import type { Product } from "@/modules/products/domain/entities/Product";
import { DeleteProductDialog } from "@/modules/products/presentation/components/DeleteProductDialog";
import { ProductFormSheet } from "@/modules/products/presentation/components/ProductFormSheet";
import { useCreateProduct } from "@/modules/products/presentation/hooks/useCreateProduct";
import { useDeleteProduct } from "@/modules/products/presentation/hooks/useDeleteProduct";
import { useProducts } from "@/modules/products/presentation/hooks/useProducts";
import { useUpdateProduct } from "@/modules/products/presentation/hooks/useUpdateProduct";
import { useDefaultTeam } from "@/modules/teams/presentation/hooks/useDefaultTeam";
import { useTeams } from "@/modules/teams/presentation/hooks/useTeams";

function formatCurrency(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

function StockBadge({
	quantity,
	minimum,
}: {
	quantity: number;
	minimum: number;
}) {
	if (quantity === 0) return <Badge variant="destructive">Sem estoque</Badge>;
	if (quantity <= minimum)
		return <Badge variant="warning">Estoque baixo</Badge>;
	return <Badge variant="success">Em estoque</Badge>;
}

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

	useEffect(() => {
		const timeout = setTimeout(() => setCategory(categoryInput.trim()), 400);
		return () => clearTimeout(timeout);
	}, [categoryInput]);

	useEffect(() => {
		setPage(1);
	}, [selectedTeamId, category, onlyPortioned]);

	const {
		data: result,
		isLoading,
		isError,
	} = useProducts(selectedTeamId, {
		page,
		limit,
		category: category || undefined,
		isPortioned: onlyPortioned ? true : undefined,
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
		<div className="p-6 flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Produtos</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Gerencie o estoque de produtos
					</p>
				</div>
				<Button onClick={handleNewProduct} disabled={!selectedTeamId}>
					<PlusIcon />
					Novo produto
				</Button>
			</div>

			{!hasDefault && (
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-foreground shrink-0">
						Equipe:
					</span>
					<Select
						value={manualTeamId ?? ""}
						onValueChange={(v) => setManualTeamId(v || null)}
					>
						<SelectTrigger className="w-64">
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
				<div className="flex items-center gap-3 flex-wrap">
					<span className="text-sm font-medium text-foreground shrink-0">
						Categoria:
					</span>
					<Input
						value={categoryInput}
						onChange={(e) => setCategoryInput(e.target.value)}
						placeholder="Filtrar por categoria"
						className="w-64"
					/>

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
		</div>
	);
}
