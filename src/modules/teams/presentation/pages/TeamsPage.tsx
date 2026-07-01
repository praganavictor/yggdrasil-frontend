import { PencilIcon, PlusIcon, TrashIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
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
import type { CreateTeamDto } from "@/modules/teams/application/dtos/TeamDto";
import type { Team } from "@/modules/teams/domain/entities/Team";
import { useAuthState } from "@/modules/auth/presentation/hooks/useAuthState";
import { DeleteTeamDialog } from "@/modules/teams/presentation/components/DeleteTeamDialog";
import { TeamFormSheet } from "@/modules/teams/presentation/components/TeamFormSheet";
import { TeamMembersSheet } from "@/modules/teams/presentation/components/TeamMembersSheet";
import { useCreateTeam } from "@/modules/teams/presentation/hooks/useCreateTeam";
import { useDeleteTeam } from "@/modules/teams/presentation/hooks/useDeleteTeam";
import { useTeams } from "@/modules/teams/presentation/hooks/useTeams";
import { useUpdateTeam } from "@/modules/teams/presentation/hooks/useUpdateTeam";

export function TeamsPage() {
	const { user } = useAuthState();
	const { data: teams = [], isLoading, isError } = useTeams();
	const createTeam = useCreateTeam();
	const updateTeam = useUpdateTeam();
	const deleteTeam = useDeleteTeam();

	const [formOpen, setFormOpen] = useState(false);
	const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
	const [membersSheetOpen, setMembersSheetOpen] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

	function handleNewTeam() {
		setEditingTeam(undefined);
		setFormOpen(true);
	}

	function handleEditTeam(team: Team) {
		setEditingTeam(team);
		setFormOpen(true);
	}

	function handleDeleteTeam(team: Team) {
		setDeletingTeam(team);
		setDeleteDialogOpen(true);
	}

	function handleViewMembers(team: Team) {
		setSelectedTeam(team);
		setMembersSheetOpen(true);
	}

	function handleFormSubmit(dto: CreateTeamDto) {
		if (editingTeam) {
			updateTeam.mutate(
				{ id: editingTeam.id, dto },
				{ onSuccess: () => setFormOpen(false) },
			);
		} else {
			createTeam.mutate(dto, { onSuccess: () => setFormOpen(false) });
		}
	}

	function handleDeleteConfirm() {
		if (!deletingTeam) return;
		deleteTeam.mutate(deletingTeam.id, {
			onSuccess: () => {
				setDeleteDialogOpen(false);
				setDeletingTeam(null);
			},
		});
	}

	const isPendingForm = createTeam.isPending || updateTeam.isPending;

	return (
		<div className="p-6 flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Equipes</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Gerencie as equipes e seus membros
					</p>
				</div>
				<Button onClick={handleNewTeam}>
					<PlusIcon />
					Nova equipe
				</Button>
			</div>

			<Card>
				<CardHeader className="border-b">
					<CardTitle>Lista de equipes</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading && (
						<div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
							Carregando equipes...
						</div>
					)}

					{isError && (
						<div className="flex items-center justify-center py-12 text-destructive text-sm">
							Erro ao carregar equipes. Tente novamente.
						</div>
					)}

					{!isLoading && !isError && teams.length === 0 && (
						<div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
							<p className="text-sm">Nenhuma equipe encontrada.</p>
							<Button variant="outline" size="sm" onClick={handleNewTeam}>
								<PlusIcon />
								Criar primeira equipe
							</Button>
						</div>
					)}

					{!isLoading && !isError && teams.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nome</TableHead>
									<TableHead>Descrição</TableHead>
									<TableHead className="w-32">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{teams.map((team) => {
									const isOwner = team.ownerId === user?.id;
									return (
										<TableRow key={team.id}>
											<TableCell className="font-medium">{team.name}</TableCell>
											<TableCell className="text-muted-foreground max-w-xs truncate">
												{team.description ?? "—"}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Button
														variant="ghost"
														size="icon-sm"
														onClick={() => handleViewMembers(team)}
														aria-label="Ver membros"
													>
														<UsersIcon />
													</Button>
													{isOwner && (
														<>
															<Button
																variant="ghost"
																size="icon-sm"
																onClick={() => handleEditTeam(team)}
																aria-label="Editar equipe"
															>
																<PencilIcon />
															</Button>
															<Button
																variant="ghost"
																size="icon-sm"
																className="text-destructive hover:text-destructive"
																onClick={() => handleDeleteTeam(team)}
																aria-label="Excluir equipe"
															>
																<TrashIcon />
															</Button>
														</>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<TeamFormSheet
				open={formOpen}
				onOpenChange={setFormOpen}
				team={editingTeam}
				onSubmit={handleFormSubmit}
				isPending={isPendingForm}
			/>

			<DeleteTeamDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				team={deletingTeam}
				onConfirm={handleDeleteConfirm}
				isPending={deleteTeam.isPending}
			/>

			<TeamMembersSheet
				open={membersSheetOpen}
				onOpenChange={setMembersSheetOpen}
				team={selectedTeam}
				currentUserId={user?.id ?? null}
			/>
		</div>
	);
}
