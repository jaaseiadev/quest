import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin";
import { requireAdmin } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    redirect(auth.status === 401 ? "/auth/login" : "/dashboard");
  }

  return (
    <AdminShell displayName={auth.profile.display_name || auth.profile.email}>
      {children}
    </AdminShell>
  );
}
