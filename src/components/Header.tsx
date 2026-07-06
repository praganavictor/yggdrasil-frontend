import { Link } from "@tanstack/react-router";
import {
	ArrowLeftRight,
	Home,
	LogOut,
	Menu,
	Moon,
	Package,
	Settings,
	Sun,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useLogout } from "@/modules/auth/presentation/hooks/useLogout";
import { useTheme } from "@/shared/hooks/useTheme";

export default function Header() {
	const [open, setOpen] = useState(false);
	const { logout, isPending } = useLogout();
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="flex items-center gap-3 border-b bg-gray-900 px-4 py-3 shadow-sm">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="size-9 text-white hover:bg-gray-700 hover:text-white"
						aria-label="Abrir menu"
					>
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-72">
					<SheetHeader>
						<SheetTitle>Navegação</SheetTitle>
					</SheetHeader>
					<nav className="flex flex-col gap-1 px-2 py-4">
						<Link
							to="/"
							onClick={() => setOpen(false)}
							className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
							activeProps={{
								className:
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors",
							}}
						>
							<Home size={18} />
							Início
						</Link>
						<Link
							to="/produtos"
							onClick={() => setOpen(false)}
							className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
							activeProps={{
								className:
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors",
							}}
						>
							<Package size={18} />
							Produtos
						</Link>
						<Link
							to="/movimentacoes"
							onClick={() => setOpen(false)}
							className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
							activeProps={{
								className:
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors",
							}}
						>
							<ArrowLeftRight size={18} />
							Movimentações
						</Link>
						<div className="my-2 border-t" />

						<div className="flex items-center gap-1">
							<Link
								to="/configuracoes"
								onClick={() => setOpen(false)}
								className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
								activeProps={{
									className:
										"flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors",
								}}
							>
								<Settings size={18} />
								Configurações
							</Link>
							<Button
								variant="ghost"
								size="icon"
								className="size-10 shrink-0 text-foreground hover:bg-muted"
								aria-label={
									theme === "dark"
										? "Mudar para tema claro"
										: "Mudar para tema escuro"
								}
								onClick={toggleTheme}
							>
								{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
							</Button>
						</div>
					</nav>
				</SheetContent>
			</Sheet>

			<Link to="/">
				<img
					src="/tanstack-word-logo-white.svg"
					alt="TanStack Logo"
					className="h-8"
				/>
			</Link>

			<div className="ml-auto">
				<Button
					variant="ghost"
					size="icon"
					className="size-9 text-white hover:bg-gray-700 hover:text-white"
					aria-label="Sair"
					onClick={() => logout()}
					disabled={isPending}
				>
					<LogOut />
				</Button>
			</div>
		</header>
	);
}
