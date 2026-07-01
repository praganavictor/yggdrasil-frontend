import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	limitOptions?: number[];
}

export function PaginationControls({
	page,
	totalPages,
	total,
	limit,
	onPageChange,
	onLimitChange,
	limitOptions = [10, 20, 50],
}: PaginationControlsProps) {
	const safeTotalPages = Math.max(totalPages, 1);
	const start = total === 0 ? 0 : (page - 1) * limit + 1;
	const end = Math.min(page * limit, total);

	return (
		<div className="flex items-center justify-between gap-4 px-4 py-3 border-t">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>Itens por página:</span>
				<Select
					value={String(limit)}
					onValueChange={(v) => onLimitChange(Number(v))}
				>
					<SelectTrigger className="w-18">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{limitOptions.map((option) => (
							<SelectItem key={option} value={String(option)}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-4">
				<span className="text-sm text-muted-foreground">
					{total === 0 ? "0 resultados" : `${start}–${end} de ${total}`}
				</span>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() => onPageChange(page - 1)}
						disabled={page <= 1}
						aria-label="Página anterior"
					>
						<ChevronLeftIcon />
					</Button>
					<span className="text-sm text-muted-foreground w-16 text-center">
						{page} de {safeTotalPages}
					</span>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() => onPageChange(page + 1)}
						disabled={page >= safeTotalPages}
						aria-label="Próxima página"
					>
						<ChevronRightIcon />
					</Button>
				</div>
			</div>
		</div>
	);
}
