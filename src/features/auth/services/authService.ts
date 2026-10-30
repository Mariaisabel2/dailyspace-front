import { LoginDto, RegisterDto, AuthResponse, User } from "../domain/auth";
import { httpClient } from "../../common/http";
import { authStorage } from "./authStorage";

/**
 * Servicio de Autenticación de DailySpace conectado a la API REST.
 */
export const authService = {
  /**
   * Inicia sesión con email y contraseña.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await httpClient<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: dto,
    });
    authStorage.setSession(response.token, response.user);
    return response;
  },

  /**
   * Registra un nuevo usuario en DailySpace.
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const response = await httpClient<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: dto,
    });
    authStorage.setSession(response.token, response.user);
    return response;
  },

  /**
   * Cierra la sesión activa.
   */
  logout(): void {
    authStorage.clearSession();
  },

  /**
   * Obtiene el usuario actual desde el almacenamiento local.
   */
  getCurrentUser(): User | null {
    return authStorage.getUser();
  },

  /**
   * Obtiene el token JWT actual.
   */
  getToken(): string | null {
    return authStorage.getToken();
  },

  /**
   * Determina si hay una sesión activa.
   */
  isAuthenticated(): boolean {
    return authStorage.isAuthenticated();
  },
};
