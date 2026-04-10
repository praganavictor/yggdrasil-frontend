import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/demo/tanstack-query")({
	component: TanStackQueryDemo,
});

function TanStackQueryDemo() {
	const { data } = useQuery({
		queryKey: ["todos"],
		queryFn: () =>
			Promise.resolve([
				{ id: 1, name: "Alice" },
				{ id: 2, name: "Bob" },
				{ id: 3, name: "Charlie" },
			]),
		initialData: [],
	});

	return (
		<div
			className="flex items-center justify-center min-h-screen p-4"
			style={{
				backgroundImage:
					"radial-gradient(50% 50% at 95% 5%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)",
			}}
		>
			<Card className="w-full max-w-2xl bg-black/50 text-white border-white/10 backdrop-blur-md">
				<CardHeader>
					<CardTitle className="text-white text-2xl">
						TanStack Query Simple Promise Handling
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2">
						{data.map((todo) => (
							<li key={todo.id}>
								<Card className="bg-white/10 border-white/20 text-white">
									<CardContent className="py-3">
										<span className="text-lg">{todo.name}</span>
									</CardContent>
								</Card>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
