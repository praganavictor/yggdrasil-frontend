import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
	quantity: number;
	minimum: number;
}

export function StockBadge({ quantity, minimum }: StockBadgeProps) {
	if (quantity === 0) return <Badge variant="destructive">Sem estoque</Badge>;
	if (quantity <= minimum)
		return <Badge variant="warning">Estoque baixo</Badge>;
	return <Badge variant="success">Em estoque</Badge>;
}
