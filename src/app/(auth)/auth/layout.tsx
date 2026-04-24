import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container-apex flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-xl">{children}</div>
      </div>
    </main>
  );
}
