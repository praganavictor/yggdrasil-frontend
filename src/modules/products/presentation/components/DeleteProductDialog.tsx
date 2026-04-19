import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/modules/products/domain/entities/Product";

interface DeleteProductDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: Product | null;
	onConfirm: () => void;
	isPending: boolean;
}

export function DeleteProductDialog({
	open,
	onOpenChange,
	product,
	onConfirm,
	isPending,
}: DeleteProductDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Excluir produto</DialogTitle>
					<DialogDescription>
						Tem certeza que deseja excluir{" "}
						<strong className="text-foreground">{product?.name}</strong>? Esta
						ação não pode ser desfeita.
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
