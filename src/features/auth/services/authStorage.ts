import { User } from "../domain/auth";
import { APP_CONFIG } from "../../common/config";

export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(APP_CONFIG.tokenStorageKey);
    } catch {
      return null;
    }
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(APP_CONFIG.userStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setSession(token: string, user: User): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(APP_CONFIG.tokenStorageKey, token);
      localStorage.setItem(APP_CONFIG.userStorageKey, JSON.stringify(user));

      // Configurar cookie para Server Components y middleware (Bono +3 pts)
      const maxAge = 7 * 24 * 60 * 60; // 7 días
      document.cookie = `${APP_CONFIG.cookieTokenKey}=${encodeURIComponent(
        token
      )}; path=/; max-age=${maxAge}; SameSite=Lax`;

      // Notificar cambio de sesión a otros componentes (Navbar, etc.)
      window.dispatchEvent(new Event("dailyspace_auth_change"));
    } catch {
      // Ignorar errores de almacenamiento
    }
  },

  clearSession(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(APP_CONFIG.tokenStorageKey);
      localStorage.removeItem(APP_CONFIG.userStorageKey);
      document.cookie = `${APP_CONFIG.cookieTokenKey}=; path=/; max-age=0`;

      // Notificar cambio de sesión
      window.dispatchEvent(new Event("dailyspace_auth_change"));
    } catch {
      // Ignorar
    }
  },
};
