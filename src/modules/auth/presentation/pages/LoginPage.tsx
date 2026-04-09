import { LoginForm } from "@/modules/auth/presentation/components/LoginForm";

export function LoginPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
			<div className="w-full max-w-sm">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">
						Sign in to your account
					</h1>
					<p className="mt-2 text-sm text-gray-500">
						Enter your credentials to continue
					</p>
				</div>

				<div className="rounded-2xl bg-white px-8 py-10 shadow-sm ring-1 ring-gray-200">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
