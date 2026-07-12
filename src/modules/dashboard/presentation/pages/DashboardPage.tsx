import { Link } from "@tanstack/react-router";
import {
	ArrowDownCircleIcon,
	ArrowUpCircleIcon,
	ChevronRightIcon,
	PackageIcon,
	ScanBarcodeIcon,
	TriangleAlertIcon,
	UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAuthState } from "@/modules/auth/presentation/hooks/useAuthState";
import {
	type TeamSummary,
	useTeamsSummaries,
} from "@/modules/dashboard/presentation/hooks/useTeamsSummaries";
import { useProducts } from "@/modules/products/presentation/hooks/useProducts";
import { useStockMoviments } from "@/modules/stockMoviment/presentation/hooks/useStockMoviments";
import { useDefaultTeam } from "@/modules/teams/presentation/hooks/useDefaultTeam";
import { useTeams } from "@/modules/teams/presentation/hooks/useTeams";

const ALL_TEAMS = "all";

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
	to,
}: {
	label: string;
	value: string;
	icon: React.ReactNode;
	variant?: "default" | "warning" | "danger";
	to?: string;
}) {
	const valueClass =
		variant === "danger"
			? "text-destructive"
			: variant === "warning"
				? "text-amber-600 dark:text-amber-400"
				: "text-foreground";

	const card = (
		<Card
			size="sm"
			className={to ? "transition-colors hover:bg-accent" : undefined}
		>
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

	if (to) {
		return (
			<Link to={to} className="block">
				{card}
			</Link>
		);
	}

	return card;
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

function TeamSummaryCard({
	summary,
	onSelect,
}: {
	summary: TeamSummary;
	onSelect: () => void;
}) {
	const { team, products, moviments, isLoading } = summary;
	const lowStock = products.filter(
		(p) => p.quantity > 0 && p.quantity <= p.minumum,
	).length;
	const outOfStock = products.filter((p) => p.quantity === 0).length;
	const totalEntradas = moviments
		.filter((m) => m.type === "entrada")
		.reduce((acc, m) => acc + m.quantity * m.price, 0);
	const totalSaidas = moviments
		.filter((m) => m.type === "saída")
		.reduce((acc, m) => acc + m.quantity * m.price, 0);

	return (
		<button type="button" onClick={onSelect} className="w-full text-left">
			<Card size="sm" className="h-full transition-colors hover:bg-accent">
				<CardHeader className="border-b">
					<div className="flex items-center justify-between gap-2">
						<div className="flex min-w-0 items-center gap-2">
							<UsersIcon className="size-4 shrink-0 text-muted-foreground" />
							<span className="truncate font-medium text-foreground">
								{team.name}
							</span>
						</div>
						<ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent className="p-4">
					{isLoading ? (
						<p className="text-sm text-muted-foreground">
							Carregando resumo...
						</p>
					) : (
						<div className="flex flex-col gap-1.5 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Produtos</span>
								<span className="tabular-nums font-medium text-foreground">
									{products.length}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Estoque baixo</span>
								<span
									className={`tabular-nums font-medium ${
										lowStock > 0
											? "text-amber-600 dark:text-amber-400"
											: "text-foreground"
									}`}
								>
									{lowStock}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Sem estoque</span>
								<span
									className={`tabular-nums font-medium ${
										outOfStock > 0 ? "text-destructive" : "text-foreground"
									}`}
								>
									{outOfStock}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Entradas</span>
								<span className="tabular-nums font-medium text-foreground">
									{currency.format(totalEntradas)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Saídas</span>
								<span className="tabular-nums font-medium text-foreground">
									{currency.format(totalSaidas)}
								</span>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</button>
	);
}

export function DashboardPage() {
	const { user } = useAuthState();
	const { defaultTeamId, setDefault } = useDefaultTeam();

	const { data: teams = [] } = useTeams();

	const [selection, setSelection] = useState<string>(ALL_TEAMS);
	const isAllView = selection === ALL_TEAMS;
	const selectedTeamId = isAllView ? null : selection;
	const activeTeamName = teams.find((t) => t.id === selectedTeamId)?.name;

	function handleSelectionChange(value: string) {
		if (!value) return;
		setSelection(value);
		if (value !== ALL_TEAMS && value !== defaultTeamId) {
			setDefault(value);
		}
	}

	const { data: productsResult } = useProducts(selectedTeamId, { limit: 1000 });
	const { data: movimentsResult } = useStockMoviments(selectedTeamId, {
		limit: 1000,
	});
	const { summaries, isLoading: summariesLoading } = useTeamsSummaries(
		isAllView ? teams : [],
	);

	const products = isAllView
		? summaries.flatMap((s) => s.products)
		: (productsResult?.data ?? []);
	const moviments = isAllView
		? summaries.flatMap((s) =>
				s.moviments.map((m) => ({ ...m, teamName: s.team.name })),
			)
		: (movimentsResult?.data ?? []).map((m) => ({
				...m,
				teamName: undefined as string | undefined,
			}));

	const lowStock = products.filter(
		(p) => p.quantity > 0 && p.quantity <= p.minumum,
	);
	const outOfStock = products.filter((p) => p.quantity === 0);

	const entradas = moviments.filter((m) => m.type === "entrada");
	const saidas = moviments.filter((m) => m.type === "saída");
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
		<div className="p-4 sm:p-6 pb-24 flex flex-col gap-4 sm:gap-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Olá, {firstName}
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Aqui está um resumo do seu estoque —{" "}
						<span className="font-medium text-foreground">
							{isAllView ? "Todas as equipes" : (activeTeamName ?? "Equipe")}
						</span>
					</p>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
					<span className="text-sm font-medium text-foreground shrink-0">
						Equipe:
					</span>
					<Select value={selection} onValueChange={handleSelectionChange}>
						<SelectTrigger className="w-full sm:w-52">
							<SelectValue placeholder="Selecione uma equipe" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL_TEAMS}>Todas as equipes</SelectItem>
							{teams.map((team) => (
								<SelectItem key={team.id} value={team.id}>
									{team.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					Produtos
				</h2>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
					<StatCard
						label="Total de produtos"
						value={String(products.length)}
						icon={<PackageIcon className="size-4 text-muted-foreground" />}
						to="/produtos"
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
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
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

			{isAllView && (
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Resumo por equipe
					</h2>
					{teams.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center gap-2 p-6 text-center">
								<UsersIcon className="size-8 text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									Você ainda não participa de nenhuma equipe.
								</p>
								<Button asChild variant="outline" size="sm">
									<Link to="/equipes">Gerenciar equipes</Link>
								</Button>
							</CardContent>
						</Card>
					) : summariesLoading ? (
						<p className="py-4 text-center text-sm text-muted-foreground">
							Carregando resumos das equipes...
						</p>
					) : (
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
							{summaries.map((summary) => (
								<TeamSummaryCard
									key={summary.team.id}
									summary={summary}
									onSelect={() => handleSelectionChange(summary.team.id)}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{recentMoviments.length > 0 && (
				<Card>
					<CardHeader className="border-b">
						<CardTitle>Últimas movimentações</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="flex flex-col divide-y md:hidden">
							{recentMoviments.map((moviment) => (
								<div key={moviment.id} className="flex flex-col gap-1.5 p-4">
									<div className="flex items-center gap-2">
										<TypeBadge type={moviment.type} />
										<span className="text-xs text-muted-foreground">
											{dateFormat.format(new Date(moviment.date))}
										</span>
										{moviment.teamName && (
											<span className="truncate text-xs text-muted-foreground">
												· {moviment.teamName}
											</span>
										)}
									</div>
									<span className="truncate font-medium text-foreground">
										{moviment.product?.name ?? moviment.productId}
									</span>
									<span className="text-sm tabular-nums text-muted-foreground">
										{moviment.quantity} un ·{" "}
										<span className="font-medium text-foreground">
											{currency.format(moviment.quantity * moviment.price)}
										</span>
									</span>
								</div>
							))}
						</div>

						<div className="hidden md:block">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Data</TableHead>
										<TableHead>Tipo</TableHead>
										{isAllView && <TableHead>Equipe</TableHead>}
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
											{isAllView && (
												<TableCell className="text-muted-foreground">
													{moviment.teamName}
												</TableCell>
											)}
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
						</div>
					</CardContent>
				</Card>
			)}

			<Button
				asChild
				size="icon"
				className="fixed bottom-5 left-5 z-40 size-14 rounded-full shadow-lg [&_svg]:size-6"
			>
				<Link to="/scanner" aria-label="Escanear código de barras">
					<ScanBarcodeIcon />
				</Link>
			</Button>
		</div>
	);
}
