import { Link } from "@tanstack/react-router";
import { Home, Menu, Network } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
	const [open, setOpen] = useState(false);

	return (
		<header className="flex items-center gap-3 border-b bg-gray-900 px-4 py-3 shadow-sm">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="text-white hover:bg-gray-700 hover:text-white"
						aria-label="Open menu"
					>
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-72">
					<SheetHeader>
						<SheetTitle>Navigation</SheetTitle>
					</SheetHeader>
					<nav className="flex flex-col gap-1 px-2 py-4">
						<Link
							to="/"
							onClick={() => setOpen(false)}
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
							activeProps={{
								className:
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors",
							}}
						>
							<Home size={18} />
							Home
						</Link>
						<Link
							to="/demo/tanstack-query"
							onClick={() => setOpen(false)}
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
							activeProps={{
								className:
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors",
							}}
						>
							<Network size={18} />
							TanStack Query
						</Link>
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
		</header>
	);
}
