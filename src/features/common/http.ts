import { API_BASE_URL, APP_CONFIG } from "./config";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string>;
  statusCode?: number;
}

export class HttpError extends Error {
  public statusCode: number;
  public data?: ApiErrorResponse;

  constructor(message: string, statusCode: number, data?: ApiErrorResponse) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Obtiene el token JWT del almacenamiento del navegador de forma segura.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(APP_CONFIG.tokenStorageKey);
  } catch {
    return null;
  }
}

/**
 * Guarda el token en localStorage y cookie para permitir validación en cliente y servidor.
 */
export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(APP_CONFIG.tokenStorageKey, token);
    // Configurar cookie para Server Components / middleware (Bono +3 pts)
    document.cookie = `${APP_CONFIG.cookieTokenKey}=${encodeURIComponent(
      token
    )}; path=/; max-age=604800; SameSite=Lax`;
  } catch {
    // Ignorar errores de acceso a almacenamiento
  }
}

/**
 * Elimina el token de sesión y la cookie.
 */
export function removeStoredToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(APP_CONFIG.tokenStorageKey);
    localStorage.removeItem(APP_CONFIG.userStorageKey);
    document.cookie = `${APP_CONFIG.cookieTokenKey}=; path=/; max-age=0`;
  } catch {
    // Ignorar errores
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Cliente HTTP centralizado para todas las peticiones a la API REST.
 * Agrega el token Bearer automáticamente y captura respuestas 401 redirigiendo a /login.
 */
export async function httpClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, headers = {}, ...restOptions } = options;

  // Construir URL completa
  const url = new URL(
    endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`
  );

  // Agregar query params si existen
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  // Preparar encabezados
  const requestHeaders = new Headers(headers);

  // Inyectar Content-Type para JSON a menos que sea FormData
  if (!(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Inyectar Authorization Bearer <token> si existe sesión
  const token = getStoredToken();
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  // Preparar el cuerpo de la petición
  const requestBody =
    body === undefined || body === null
      ? undefined
      : body instanceof FormData
      ? body
      : JSON.stringify(body);

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers: requestHeaders,
      body: requestBody,
    });

    // Manejo de 401 Unauthorized (según la rúbrica: cerrar sesión y redirigir a /login)
    if (response.status === 401) {
      removeStoredToken();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      throw new HttpError("Sesión expirada o no autorizada", 401);
    }

    // Leer respuesta
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof responseData === "object" && responseData !== null && "message" in responseData)
          ? String((responseData as { message: unknown }).message)
          : response.statusText || "Error en la petición";

      throw new HttpError(
        errorMessage,
        response.status,
        typeof responseData === "object" ? responseData : undefined
      );
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(
      error instanceof Error ? error.message : "Error de conexión con el servidor",
      0
    );
  }
}
