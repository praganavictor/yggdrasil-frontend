import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/modules/auth/presentation/hooks/useLogin";

const REMEMBERED_EMAIL_KEY = "remembered_email";

function getSavedEmail(): string {
	return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "";
}

export function LoginForm() {
	const { login, isPending, errorMessage } = useLogin();
	const savedEmail = getSavedEmail();
	const [email, setEmail] = useState(savedEmail);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(savedEmail !== "");
	const emailId = useId();
	const passwordId = useId();
	const rememberMeId = useId();

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (rememberMe) {
			localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
		} else {
			localStorage.removeItem(REMEMBERED_EMAIL_KEY);
		}
		login({ email, password });
	}

	return (
		<form onSubmit={handleSubmit} noValidate className="space-y-5">
			{errorMessage && (
				<Alert variant="destructive">
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-1.5">
				<Label htmlFor={emailId}>Email address</Label>
				<Input
					id={emailId}
					type="email"
					autoComplete="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isPending}
					placeholder="you@example.com"
				/>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={passwordId}>Password</Label>
				<div className="relative">
					<Input
						id={passwordId}
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={isPending}
						placeholder="••••••••"
						className="pr-10"
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff /> : <Eye />}
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Checkbox
					id={rememberMeId}
					checked={rememberMe}
					onCheckedChange={(checked) => setRememberMe(checked === true)}
					disabled={isPending}
				/>
				<Label htmlFor={rememberMeId} className="cursor-pointer font-normal">
					Lembrar meu e-mail
				</Label>
			</div>

			<Button
				type="submit"
				disabled={isPending || !email || !password}
				className="w-full"
				size="lg"
			>
				{isPending ? (
					<>
						<Loader2 className="animate-spin" />
						Signing in…
					</>
				) : (
					<>
						<LogIn />
						Sign in
					</>
				)}
			</Button>
		</form>
	);
}
