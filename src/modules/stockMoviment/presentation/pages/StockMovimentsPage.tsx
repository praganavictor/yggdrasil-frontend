import {
	ArrowDownCircleIcon,
	ArrowUpCircleIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from "lucide-react";
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
import type { CreateStockMovimentDto } from "@/modules/stockMoviment/application/dtos/StockMovimentDto";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";
import { DeleteStockMovimentDialog } from "@/modules/stockMoviment/presentation/components/DeleteStockMovimentDialog";
import { StockMovimentFormSheet } from "@/modules/stockMoviment/presentation/components/StockMovimentFormSheet";
import { useCreateStockMoviment } from "@/modules/stockMoviment/presentation/hooks/useCreateStockMoviment";
import { useDeleteStockMoviment } from "@/modules/stockMoviment/presentation/hooks/useDeleteStockMoviment";
import { useStockMoviments } from "@/modules/stockMoviment/presentation/hooks/useStockMoviments";
import { useUpdateStockMoviment } from "@/modules/stockMoviment/presentation/hooks/useUpdateStockMoviment";

const currency = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
});

function TypeBadge({ type }: { type: string }) {
	if (type === "entrada") {
		return (
			<Badge variant="success" className="gap-1">
				<ArrowDownCircleIcon className="size-3" />
				Entrada
			</Badge>
		);
	}
	return (
		<Badge variant="destructive" className="gap-1">
			<ArrowUpCircleIcon className="size-3" />
			Saída
		</Badge>
	);
}

function SummaryCard({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon: React.ReactNode;
}) {
	return (
		<Card size="sm">
			<CardHeader>
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted-foreground">{label}</span>
					{icon}
				</div>
				<p className="text-xl font-semibold tabular-nums">{value}</p>
			</CardHeader>
		</Card>
	);
}

export function StockMovimentsPage() {
	const { data: moviments = [], isLoading, isError } = useStockMoviments();
	const createMoviment = useCreateStockMoviment();
	const updateMoviment = useUpdateStockMoviment();
	const deleteMoviment = useDeleteStockMoviment();

	const [formOpen, setFormOpen] = useState(false);
	const [editingMoviment, setEditingMoviment] = useState<
		StockMoviment | undefined
	>(undefined);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletingMoviment, setDeletingMoviment] =
		useState<StockMoviment | null>(null);

	function handleNew() {
		setEditingMoviment(undefined);
		setFormOpen(true);
	}

	function handleEdit(moviment: StockMoviment) {
		setEditingMoviment(moviment);
		setFormOpen(true);
	}

	function handleDelete(moviment: StockMoviment) {
		setDeletingMoviment(moviment);
		setDeleteDialogOpen(true);
	}

	function handleFormSubmit(dto: CreateStockMovimentDto) {
		if (editingMoviment) {
			updateMoviment.mutate(
				{ id: editingMoviment.id, dto },
				{ onSuccess: () => setFormOpen(false) },
			);
		} else {
			createMoviment.mutate(dto, { onSuccess: () => setFormOpen(false) });
		}
	}

	function handleDeleteConfirm() {
		if (!deletingMoviment) return;
		deleteMoviment.mutate(deletingMoviment.id, {
			onSuccess: () => {
				setDeleteDialogOpen(false);
				setDeletingMoviment(null);
			},
		});
	}

	const entradas = moviments.filter((m) => m.type === "entrada");
	const saidas = moviments.filter((m) => m.type === "saida");
	const totalEntradas = entradas.reduce(
		(acc, m) => acc + m.quantity * m.price,
		0,
	);
	const totalSaidas = saidas.reduce((acc, m) => acc + m.quantity * m.price, 0);

	const isPendingForm =
		createMoviment.isPending || updateMoviment.isPending;

	return (
		<div className="p-6 flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Movimentações de Estoque
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Registre entradas e saídas de produtos
					</p>
				</div>
				<Button onClick={handleNew}>
					<PlusIcon />
					Nova movimentação
				</Button>
			</div>

			{!isLoading && !isError && moviments.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<SummaryCard
						label="Total de movimentações"
						value={String(moviments.length)}
						icon={null}
					/>
					<SummaryCard
						label="Total de entradas"
						value={currency.format(totalEntradas)}
						icon={
							<ArrowDownCircleIcon className="size-4 text-green-600" />
						}
					/>
					<SummaryCard
						label="Total de saídas"
						value={currency.format(totalSaidas)}
						icon={
							<ArrowUpCircleIcon className="size-4 text-destructive" />
						}
					/>
				</div>
			)}

			<Card>
				<CardHeader className="border-b">
					<CardTitle>Histórico de movimentações</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading && (
						<div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
							Carregando movimentações...
						</div>
					)}

					{isError && (
						<div className="flex items-center justify-center py-12 text-destructive text-sm">
							Erro ao carregar movimentações. Tente novamente.
						</div>
					)}

					{!isLoading && !isError && moviments.length === 0 && (
						<div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
							<p className="text-sm">Nenhuma movimentação registrada.</p>
							<Button variant="outline" size="sm" onClick={handleNew}>
								<PlusIcon />
								Registrar primeira movimentação
							</Button>
						</div>
					)}

					{!isLoading && !isError && moviments.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Data</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Produto</TableHead>
									<TableHead className="text-right">Qtd.</TableHead>
									<TableHead className="text-right">Preço unit.</TableHead>
									<TableHead className="text-right">Total</TableHead>
									<TableHead className="w-24">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{moviments.map((moviment) => (
									<TableRow key={moviment.id}>
										<TableCell className="text-muted-foreground whitespace-nowrap">
											{dateFormat.format(new Date(moviment.date))}
										</TableCell>
										<TableCell>
											<TypeBadge type={moviment.type} />
										</TableCell>
										<TableCell className="font-medium">
											{moviment.product?.name ?? moviment.productId}
										</TableCell>
										<TableCell className="text-right tabular-nums">
											{moviment.quantity}
										</TableCell>
										<TableCell className="text-right tabular-nums">
											{currency.format(moviment.price)}
										</TableCell>
										<TableCell className="text-right tabular-nums font-medium">
											{currency.format(moviment.quantity * moviment.price)}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<Button
													variant="ghost"
													size="icon-sm"
													onClick={() => handleEdit(moviment)}
													aria-label="Editar movimentação"
												>
													<PencilIcon />
												</Button>
												<Button
													variant="ghost"
													size="icon-sm"
													className="text-destructive hover:text-destructive"
													onClick={() => handleDelete(moviment)}
													aria-label="Excluir movimentação"
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

			<StockMovimentFormSheet
				open={formOpen}
				onOpenChange={setFormOpen}
				moviment={editingMoviment}
				onSubmit={handleFormSubmit}
				isPending={isPendingForm}
			/>

			<DeleteStockMovimentDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				moviment={deletingMoviment}
				onConfirm={handleDeleteConfirm}
				isPending={deleteMoviment.isPending}
			/>
		</div>
	);
}
