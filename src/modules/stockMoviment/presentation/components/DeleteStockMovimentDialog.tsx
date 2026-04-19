import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { StockMoviment } from "@/modules/stockMoviment/domain/entities/StockMoviment";

interface DeleteStockMovimentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	moviment: StockMoviment | null;
	onConfirm: () => void;
	isPending: boolean;
}

const typeLabel: Record<string, string> = {
	entrada: "Entrada",
	saida: "Saída",
};

export function DeleteStockMovimentDialog({
	open,
	onOpenChange,
	moviment,
	onConfirm,
	isPending,
}: DeleteStockMovimentDialogProps) {
	const label = moviment
		? `${typeLabel[moviment.type] ?? moviment.type} de ${moviment.quantity} un.`
		: "";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Excluir movimentação</DialogTitle>
					<DialogDescription>
						Tem certeza que deseja excluir a movimentação{" "}
						<strong className="text-foreground">{label}</strong>? Esta ação não
						pode ser desfeita.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={isPending}>
						{isPending ? "Excluindo..." : "Excluir"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
