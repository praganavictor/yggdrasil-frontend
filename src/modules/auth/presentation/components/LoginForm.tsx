import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { useLogin } from "@/modules/auth/presentation/hooks/useLogin";

export function LoginForm() {
	const { login, isPending, errorMessage } = useLogin();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const emailId = useId();
	const passwordId = useId();

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		login({ email, password });
	}

	return (
		<form onSubmit={handleSubmit} noValidate className="space-y-5">
			{errorMessage && (
				<div
					role="alert"
					className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
				>
					{errorMessage}
				</div>
			)}

			<div className="space-y-1.5">
				<label
					htmlFor={emailId}
					className="block text-sm font-medium text-gray-700"
				>
					Email address
				</label>
				<input
					id={emailId}
					type="email"
					autoComplete="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isPending}
					placeholder="you@example.com"
					className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
				/>
			</div>

			<div className="space-y-1.5">
				<label
					htmlFor={passwordId}
					className="block text-sm font-medium text-gray-700"
				>
					Password
				</label>
				<div className="relative">
					<input
						id={passwordId}
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={isPending}
						placeholder="••••••••"
						className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				</div>
			</div>

			<button
				type="submit"
				disabled={isPending || !email || !password}
				className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
			>
				{isPending ? (
					<>
						<Loader2 size={18} className="animate-spin" />
						Signing in…
					</>
				) : (
					<>
						<LogIn size={18} />
						Sign in
					</>
				)}
			</button>
		</form>
	);
}
