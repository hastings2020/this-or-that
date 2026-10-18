const STORAGE_KEY = "this-or-that-username";

export function getStoredUsername(): string | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value?.trim() ? value.trim() : null;
}

export function setStoredUsername(username: string) {
  const cleaned = username.trim().replace(/\s+/g, " ");
  window.localStorage.setItem(STORAGE_KEY, cleaned);
  return cleaned;
}

export function clearStoredUsername() {
  window.localStorage.removeItem(STORAGE_KEY);
}
