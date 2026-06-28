import {
	ArrowDownCircleIcon,
	ArrowUpCircleIcon,
	PackageIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAuthState } from "@/modules/auth/presentation/hooks/useAuthState";
import { useProducts } from "@/modules/products/presentation/hooks/useProducts";
import { useStockMoviments } from "@/modules/stockMoviment/presentation/hooks/useStockMoviments";

const currency = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
});

function StatCard({
	label,
	value,
	icon,
	variant,
}: {
	label: string;
	value: string;
	icon: React.ReactNode;
	variant?: "default" | "warning" | "danger";
}) {
	const valueClass =
		variant === "danger"
			? "text-destructive"
			: variant === "warning"
				? "text-amber-600 dark:text-amber-400"
				: "text-foreground";

	return (
		<Card size="sm">
			<CardHeader>
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted-foreground">{label}</span>
					{icon}
				</div>
				<p className={`text-xl font-semibold tabular-nums ${valueClass}`}>
					{value}
				</p>
			</CardHeader>
		</Card>
	);
}

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

export function DashboardPage() {
	const { user } = useAuthState();
	const { data: products = [] } = useProducts();
	const { data: moviments = [] } = useStockMoviments();

	const lowStock = products.filter(
		(p) => p.quantity > 0 && p.quantity <= p.minumum,
	);
	const outOfStock = products.filter((p) => p.quantity === 0);

	const entradas = moviments.filter((m) => m.type === "entrada");
	const saidas = moviments.filter((m) => m.type === "saida");
	const totalEntradas = entradas.reduce(
		(acc, m) => acc + m.quantity * m.price,
		0,
	);
	const totalSaidas = saidas.reduce((acc, m) => acc + m.quantity * m.price, 0);

	const recentMoviments = [...moviments]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 5);

	const firstName = user?.name?.split(" ")[0] ?? "usuário";

	return (
		<div className="p-6 flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold text-foreground">
					Olá, {firstName}
				</h1>
				<p className="text-sm text-muted-foreground mt-0.5">
					Aqui está um resumo do seu estoque
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					Produtos
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<StatCard
						label="Total de produtos"
						value={String(products.length)}
						icon={<PackageIcon className="size-4 text-muted-foreground" />}
					/>
					<StatCard
						label="Estoque baixo"
						value={String(lowStock.length)}
						icon={<TriangleAlertIcon className="size-4 text-amber-500" />}
						variant={lowStock.length > 0 ? "warning" : "default"}
					/>
					<StatCard
						label="Sem estoque"
						value={String(outOfStock.length)}
						icon={<TriangleAlertIcon className="size-4 text-destructive" />}
						variant={outOfStock.length > 0 ? "danger" : "default"}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					Movimentações
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<StatCard
						label="Total de movimentações"
						value={String(moviments.length)}
						icon={null}
					/>
					<StatCard
						label="Total de entradas"
						value={currency.format(totalEntradas)}
						icon={<ArrowDownCircleIcon className="size-4 text-green-600" />}
					/>
					<StatCard
						label="Total de saídas"
						value={currency.format(totalSaidas)}
						icon={<ArrowUpCircleIcon className="size-4 text-destructive" />}
					/>
				</div>
			</div>

			{recentMoviments.length > 0 && (
				<Card>
					<CardHeader className="border-b">
						<CardTitle>Últimas movimentações</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Data</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Produto</TableHead>
									<TableHead className="text-right">Qtd.</TableHead>
									<TableHead className="text-right">Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentMoviments.map((moviment) => (
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
										<TableCell className="text-right tabular-nums font-medium">
											{currency.format(moviment.quantity * moviment.price)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
