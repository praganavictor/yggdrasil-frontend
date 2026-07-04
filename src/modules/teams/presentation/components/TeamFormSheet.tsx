import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTeamDto } from "@/modules/teams/application/dtos/TeamDto";
import type { Team } from "@/modules/teams/domain/entities/Team";

interface TeamFormSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	team?: Team;
	onSubmit: (dto: CreateTeamDto) => void;
	isPending: boolean;
}

const emptyForm: CreateTeamDto = {
	name: "",
	description: "",
};

export function TeamFormSheet({
	open,
	onOpenChange,
	team,
	onSubmit,
	isPending,
}: TeamFormSheetProps) {
	const [form, setForm] = useState<CreateTeamDto>(emptyForm);

	useEffect(() => {
		if (team) {
			setForm({ name: team.name, description: team.description ?? "" });
		} else {
			setForm(emptyForm);
		}
	}, [team, open]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		onSubmit({ ...form, description: form.description || undefined });
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-md">
				<SheetHeader>
					<SheetTitle>{team ? "Editar Equipe" : "Nova Equipe"}</SheetTitle>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="team-name">Nome</Label>
						<Input
							id="team-name"
							value={form.name}
							onChange={(e) =>
								setForm((prev) => ({ ...prev, name: e.target.value }))
							}
							placeholder="Nome da equipe"
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="team-description">Descrição</Label>
						<Textarea
							id="team-description"
							value={form.description}
							onChange={(e) =>
								setForm((prev) => ({ ...prev, description: e.target.value }))
							}
							placeholder="Descrição opcional da equipe"
							rows={3}
						/>
					</div>

					<SheetFooter className="mt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Salvando..." : "Salvar"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
