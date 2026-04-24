import { AuthTerminal, LoginForm } from "@/components/auth";
import { getSafeRedirectPath } from "@/lib/auth-redirect";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthTerminal
      eyebrow="Guild Access"
      title="Access Terminal"
      description="Authenticate credentials to enter the command center."
    >
      <LoginForm
        nextPath={getSafeRedirectPath(params.next)}
        initialError={params.error}
        initialMessage={params.message}
      />
    </AuthTerminal>
  );
}
