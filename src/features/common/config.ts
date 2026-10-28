/**
 * Configuración centralizada de variables de entorno y constantes de la aplicación.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_HOST?.replace(/\/$/, "") ||
  "http://localhost:4000";

export const APP_CONFIG = {
  apiBaseUrl: API_BASE_URL,
  siteName: "DailySpace",
  tagline: "Tu Diario Digital e Interactivo",
  tokenStorageKey: "dailyspace_token",
  userStorageKey: "dailyspace_user",
  cookieTokenKey: "token",
  defaultPageSize: 6,
} as const;
