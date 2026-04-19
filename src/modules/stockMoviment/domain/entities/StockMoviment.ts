export type StockMovimentType = "entrada" | "saida";

export interface StockMoviment {
	id: string;
	type: StockMovimentType;
	quantity: number;
	price: number;
	date: string;
	productId: string;
	product?: {
		id: string;
		name: string;
		unity: string;
	};
	createdAt?: string;
	updatedAt?: string;
}

export function createStockMoviment(data: StockMoviment): StockMoviment {
	return { ...data };
}
