import { LogOutIcon, PlusIcon, TrashIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { AddTeamMemberDto } from "@/modules/teams/application/dtos/TeamDto";
import type { Team, TeamMemberRole, TeamMembership } from "@/modules/teams/domain/entities/Team";
import { useAddTeamMember } from "@/modules/teams/presentation/hooks/useAddTeamMember";
import { useRemoveTeamMember } from "@/modules/teams/presentation/hooks/useRemoveTeamMember";
import { useTeamMembers } from "@/modules/teams/presentation/hooks/useTeamMembers";

const roleLabel: Record<TeamMemberRole, string> = {
	ADMIN: "Admin",
	SUPERVISOR: "Supervisor",
	ATTENDANT: "Atendente",
};

const roleVariant: Record<TeamMemberRole, "default" | "secondary" | "outline"> = {
	ADMIN: "default",
	SUPERVISOR: "secondary",
	ATTENDANT: "outline",
};

interface AddMemberFormProps {
	teamId: string;
	onClose: () => void;
}

function AddMemberForm({ teamId, onClose }: AddMemberFormProps) {
	const [form, setForm] = useState<AddTeamMemberDto>({ email: "", role: "ATTENDANT" });
	const addMember = useAddTeamMember(teamId);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		addMember.mutate(form, { onSuccess: onClose });
	}

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent showCloseButton={false} className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Adicionar membro</DialogTitle>
					<DialogDescription>
						Digite o e-mail do usuário e selecione o papel na equipe.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="member-email">E-mail</Label>
						<Input
							id="member-email"
							type="email"
							value={form.email}
							onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
							placeholder="usuario@exemplo.com"
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="member-role">Papel</Label>
						<Select
							value={form.role}
							onValueChange={(v) =>
								setForm((prev) => ({ ...prev, role: v as TeamMemberRole }))
							}
						>
							<SelectTrigger id="member-role">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ATTENDANT">Atendente</SelectItem>
								<SelectItem value="SUPERVISOR">Supervisor</SelectItem>
								<SelectItem value="ADMIN">Admin</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={addMember.isPending}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={addMember.isPending}>
							{addMember.isPending ? "Adicionando..." : "Adicionar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface RemoveConfirmDialogProps {
	membership: TeamMembership;
	teamId: string;
	isSelf: boolean;
	onClose: () => void;
}

function RemoveConfirmDialog({
	membership,
	teamId,
	isSelf,
	onClose,
}: RemoveConfirmDialogProps) {
	const removeMember = useRemoveTeamMember(teamId);

	function handleConfirm() {
		removeMember.mutate(membership.id, { onSuccess: onClose });
	}

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent showCloseButton={false} className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{isSelf ? "Sair da equipe" : "Remover membro"}</DialogTitle>
					<DialogDescription>
						{isSelf
							? "Tem certeza que deseja sair desta equipe?"
							: `Tem certeza que deseja remover ${membership.user.name} da equipe?`}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={onClose}
						disabled={removeMember.isPending}
					>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={removeMember.isPending}
					>
						{removeMember.isPending
							? "Removendo..."
							: isSelf
								? "Sair"
								: "Remover"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface TeamMembersSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	team: Team | null;
	currentUserId: string | null;
}

export function TeamMembersSheet({
	open,
	onOpenChange,
	team,
	currentUserId,
}: TeamMembersSheetProps) {
	const { data: members = [], isLoading } = useTeamMembers(
		open && team ? team.id : null,
	);
	const [addingMember, setAddingMember] = useState(false);
	const [removingMembership, setRemovingMembership] =
		useState<TeamMembership | null>(null);

	const isOwner = team?.ownerId === currentUserId;

	return (
		<>
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
					<SheetHeader>
						<SheetTitle>
							{team?.name} — Membros
						</SheetTitle>
					</SheetHeader>

					<div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
						{isLoading && (
							<p className="text-sm text-muted-foreground py-6 text-center">
								Carregando membros...
							</p>
						)}

						{!isLoading && members.length === 0 && (
							<p className="text-sm text-muted-foreground py-6 text-center">
								Nenhum membro encontrado.
							</p>
						)}

						{members.map((membership) => {
							const isSelf = membership.userId === currentUserId;
							return (
								<div
									key={membership.id}
									className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
								>
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
										<UserIcon size={14} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{membership.user.name}
											{isSelf && (
												<span className="ml-1.5 text-xs text-muted-foreground">
													(você)
												</span>
											)}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{membership.user.email}
										</p>
									</div>
									<Badge variant={roleVariant[membership.role]}>
										{roleLabel[membership.role]}
									</Badge>
									{(isOwner && !isSelf) ? (
										<Button
											variant="ghost"
											size="icon-sm"
											className="text-destructive hover:text-destructive shrink-0"
											onClick={() => setRemovingMembership(membership)}
											aria-label="Remover membro"
										>
											<TrashIcon size={14} />
										</Button>
									) : isSelf ? (
										<Button
											variant="ghost"
											size="icon-sm"
											className="text-muted-foreground hover:text-foreground shrink-0"
											onClick={() => setRemovingMembership(membership)}
											aria-label="Sair da equipe"
										>
											<LogOutIcon size={14} />
										</Button>
									) : null}
								</div>
							);
						})}
					</div>

					{isOwner && (
						<div className="border-t px-4 py-3">
							<Button
								variant="outline"
								className="w-full"
								onClick={() => setAddingMember(true)}
							>
								<PlusIcon size={14} />
								Adicionar membro
							</Button>
						</div>
					)}
				</SheetContent>
			</Sheet>

			{addingMember && team && (
				<AddMemberForm
					teamId={team.id}
					onClose={() => setAddingMember(false)}
				/>
			)}

			{removingMembership && team && (
				<RemoveConfirmDialog
					membership={removingMembership}
					teamId={team.id}
					isSelf={removingMembership.userId === currentUserId}
					onClose={() => setRemovingMembership(null)}
				/>
			)}
		</>
	);
}
