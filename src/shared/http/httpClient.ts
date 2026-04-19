import { env } from "@/shared/config/env";

export class HttpError extends Error {
	constructor(
		public readonly status: number,
		public readonly body: unknown,
	) {
		super(`HTTP ${status}`);
		this.name = "HttpError";
	}
}

interface RequestOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
}

async function request<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const { body, headers, ...rest } = options;
	const response = await fetch(`${env.apiUrl}${path}`, {
		...rest,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		throw new HttpError(response.status, errorBody);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}

export const httpClient = {
	get: <T>(path: string, options?: RequestOptions) =>
		request<T>(path, { ...options, method: "GET" }),
	post: <T>(path: string, body: unknown, options?: RequestOptions) =>
		request<T>(path, { ...options, method: "POST", body }),
	put: <T>(path: string, body: unknown, options?: RequestOptions) =>
		request<T>(path, { ...options, method: "PUT", body }),
	patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
		request<T>(path, { ...options, method: "PATCH", body }),
	delete: <T>(path: string, options?: RequestOptions) =>
		request<T>(path, { ...options, method: "DELETE" }),
};
