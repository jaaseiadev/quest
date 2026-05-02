import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import {
  getSupabasePublicKey,
  getSupabasePublicUrl,
} from "@/lib/supabase/config";
import type { Database } from "@/types/db";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getSupabasePublicUrl(),
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server components cannot set cookies. Middleware refreshes sessions.
          }
        },
      },
    },
  );
}
