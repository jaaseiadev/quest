import { createBrowserClient } from "@supabase/ssr";

import {
  getSupabasePublicKey,
  getSupabasePublicUrl,
} from "@/lib/supabase/config";
import type { Database } from "@/types/db";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    getSupabasePublicUrl(),
    getSupabasePublicKey(),
  );
}
