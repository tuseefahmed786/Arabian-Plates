export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: "buyer" | "seller" | "admin";
}

export interface SessionPayload {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

const AUTH_SESSION_EVENT = "auth-session-changed";
const ACCESS_TOKEN_KEY = "plate_access_token";
const REFRESH_TOKEN_KEY = "plate_refresh_token";
const USER_KEY = "plate_user";

let lastUserRaw: string | null = null;
let lastUserSnapshot: SessionUser | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveSession(payload: SessionPayload) {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): SessionUser | null {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed?.id || !parsed?.email || !parsed?.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken() && getStoredUser());
}

export function subscribeAuthSession(callback: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if ([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].includes(event.key ?? "")) {
      callback();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_SESSION_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_SESSION_EVENT, callback);
  };
}

export function getUserSnapshot(): SessionUser | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);

  if (raw === lastUserRaw) {
    return lastUserSnapshot;
  }

  lastUserRaw = raw;

  if (!raw) {
    lastUserSnapshot = null;
    return lastUserSnapshot;
  }

  try {
    const parsed = JSON.parse(raw) as SessionUser;

    if (!parsed?.id || !parsed?.email || !parsed?.role) {
      lastUserSnapshot = null;
      return lastUserSnapshot;
    }

    lastUserSnapshot = parsed;
    return lastUserSnapshot;
  } catch {
    lastUserSnapshot = null;
    return lastUserSnapshot;
  }
}

export function getUserServerSnapshot(): SessionUser | null {
  return null;
}
