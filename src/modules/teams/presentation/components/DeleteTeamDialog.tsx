import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Team } from "@/modules/teams/domain/entities/Team";

interface DeleteTeamDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	team: Team | null;
	onConfirm: () => void;
	isPending: boolean;
}

export function DeleteTeamDialog({
	open,
	onOpenChange,
	team,
	onConfirm,
	isPending,
}: DeleteTeamDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Excluir equipe</DialogTitle>
					<DialogDescription>
						Tem certeza que deseja excluir{" "}
						<strong className="text-foreground">{team?.name}</strong>? Todos os
						membros serão removidos. Esta ação não pode ser desfeita.
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
