import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false as const,
      status: 401,
      message: "Authentication required.",
    };
  }

  return {
    ok: true as const,
    user,
  };
}
