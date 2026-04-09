export interface LoginInputDto {
	email: string;
	password: string;
}

export interface LoginOutputDto {
	user: {
		id: string;
		email: string;
		name: string;
	};
}
