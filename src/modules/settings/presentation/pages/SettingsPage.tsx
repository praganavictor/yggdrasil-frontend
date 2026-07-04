import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuthState } from "@/modules/auth/presentation/hooks/useAuthState";
import { useChangePassword } from "@/modules/auth/presentation/hooks/useChangePassword";
import { useDefaultTeam } from "@/modules/teams/presentation/hooks/useDefaultTeam";
import { useTeams } from "@/modules/teams/presentation/hooks/useTeams";
import { TeamsPage } from "@/modules/teams/presentation/pages/TeamsPage";

type Tab = "perfil" | "equipes";

function ProfileTab() {
	const { user } = useAuthState();
	const changePassword = useChangePassword();

	const [form, setForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFeedback(null);

		if (form.newPassword !== form.confirmPassword) {
			setFeedback({ type: "error", message: "As senhas não coincidem." });
			return;
		}

		if (form.newPassword.length < 6) {
			setFeedback({
				type: "error",
				message: "A nova senha deve ter pelo menos 6 caracteres.",
			});
			return;
		}

		changePassword.mutate(
			{
				currentPassword: form.currentPassword,
				newPassword: form.newPassword,
			},
			{
				onSuccess: () => {
					setForm({
						currentPassword: "",
						newPassword: "",
						confirmPassword: "",
					});
					setFeedback({
						type: "success",
						message: "Senha alterada com sucesso.",
					});
				},
				onError: () => {
					setFeedback({
						type: "error",
						message:
							"Senha atual incorreta ou erro ao alterar. Tente novamente.",
					});
				},
			},
		);
	}

	return (
		<div className="flex flex-col gap-6 max-w-lg">
			<Card>
				<CardHeader>
					<CardTitle>Informações da conta</CardTitle>
					<CardDescription>Dados do seu perfil</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label>Nome</Label>
						<Input value={user?.name ?? ""} disabled readOnly />
					</div>
					<div className="flex flex-col gap-1.5">
						<Label>E-mail</Label>
						<Input value={user?.email ?? ""} disabled readOnly />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Alterar senha</CardTitle>
					<CardDescription>
						Escolha uma senha forte com pelo menos 6 caracteres
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="currentPassword">Senha atual</Label>
							<Input
								id="currentPassword"
								type="password"
								value={form.currentPassword}
								onChange={(e) =>
									setForm((p) => ({ ...p, currentPassword: e.target.value }))
								}
								required
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label htmlFor="newPassword">Nova senha</Label>
							<Input
								id="newPassword"
								type="password"
								value={form.newPassword}
								onChange={(e) =>
									setForm((p) => ({ ...p, newPassword: e.target.value }))
								}
								required
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label htmlFor="confirmPassword">Confirmar nova senha</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={form.confirmPassword}
								onChange={(e) =>
									setForm((p) => ({ ...p, confirmPassword: e.target.value }))
								}
								required
							/>
						</div>

						{feedback && (
							<p
								className={`text-sm ${
									feedback.type === "success"
										? "text-green-600 dark:text-green-400"
										: "text-destructive"
								}`}
							>
								{feedback.message}
							</p>
						)}

						<Button
							type="submit"
							disabled={changePassword.isPending}
							className="w-full sm:w-auto sm:self-start"
						>
							{changePassword.isPending ? "Salvando..." : "Salvar senha"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

function EquipesTab() {
	const { data: teams = [] } = useTeams();
	const { defaultTeamId, setDefault } = useDefaultTeam();

	const selectedTeam = teams.find((t) => t.id === defaultTeamId);

	return (
		<div className="flex flex-col">
			<div className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
				<Card className="max-w-lg">
					<CardHeader>
						<CardTitle>Equipe padrão</CardTitle>
						<CardDescription>
							Pré-selecionada automaticamente nas páginas de Produtos,
							Movimentações e Dashboard.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<Select
							value={defaultTeamId ?? ""}
							onValueChange={(v) => setDefault(v || null)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Nenhuma equipe padrão" />
							</SelectTrigger>
							<SelectContent>
								{teams.map((team) => (
									<SelectItem key={team.id} value={team.id}>
										{team.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{selectedTeam && (
							<p className="text-xs text-muted-foreground">
								Equipe padrão atual:{" "}
								<span className="font-medium text-foreground">
									{selectedTeam.name}
								</span>
							</p>
						)}
						{defaultTeamId && (
							<Button
								variant="ghost"
								size="sm"
								className="self-start text-muted-foreground"
								onClick={() => setDefault(null)}
							>
								Remover padrão
							</Button>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="border-t mt-4" />

			<TeamsPage />
		</div>
	);
}

export function SettingsPage() {
	const [activeTab, setActiveTab] = useState<Tab>("perfil");

	return (
		<div className="flex flex-col h-full">
			<div className="border-b bg-background px-4 pt-4 sm:px-6 sm:pt-6">
				<h1 className="text-2xl font-semibold text-foreground mb-4">
					Configurações
				</h1>
				<div className="flex gap-1">
					{(
						[
							{ id: "perfil", label: "Perfil" },
							{ id: "equipes", label: "Equipes" },
						] as { id: Tab; label: string }[]
					).map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
								activeTab === tab.id
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{activeTab === "perfil" && (
					<div className="p-4 sm:p-6">
						<ProfileTab />
					</div>
				)}
				{activeTab === "equipes" && <EquipesTab />}
			</div>
		</div>
	);
}
