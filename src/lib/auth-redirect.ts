export const DEFAULT_AUTH_REDIRECT = "/dashboard";

export function getSafeRedirectPath(value: string | null | undefined) {
  if (!value) {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/auth")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return value;
}
