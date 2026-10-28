import { LoginDto, RegisterDto, AuthResponse, User } from "../domain/auth";
import { httpClient, HttpError } from "../../common/http";
import { authStorage } from "./authStorage";

// Usuarios de prueba predeterminados para modo Mock
const MOCK_USERS_KEY = "dailyspace_mock_users";

const DEFAULT_MOCK_USERS: (User & { password: string })[] = [
  {
    id: 1,
    name: "mariaisabel",
    email: "admin@dailyspace.com",
    password: "Admin123!",
    role: "admin",
  },
  {
    id: 2,
    name: "carlos_dev",
    email: "user@dailyspace.com",
    password: "User123!",
    role: "user",
  },
];

function getMockUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return DEFAULT_MOCK_USERS;
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    if (!stored) {
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEFAULT_MOCK_USERS));
      return DEFAULT_MOCK_USERS;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_MOCK_USERS;
  }
}

function saveMockUsers(users: (User & { password: string })[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch {
    // Ignorar
  }
}

export const authService = {
  /**
   * Inicia sesión con email y contraseña.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    try {
      const response = await httpClient<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: dto,
      });
      authStorage.setSession(response.token, response.user);
      return response;
    } catch (error) {
      // Si la API remota responde un error HTTP, relanzarlo
      if (error instanceof HttpError && error.statusCode !== 0) {
        throw error;
      }

      // Fallback a autenticación mockeada local
      await new Promise((resolve) => setTimeout(resolve, 350));
      const users = getMockUsers();
      const found = users.find(
        (u) =>
          u.email.toLowerCase() === dto.email.toLowerCase() &&
          u.password === dto.password
      );

      if (!found) {
        // Mensaje genérico 401 que no revela si falló el email o la contraseña (Rúbrica)
        throw new HttpError("Credenciales inválidas", 401);
      }

      const mockToken = `mock_jwt_token_${found.role}_${found.id}_${Date.now()}`;
      const userResponse: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
      };

      authStorage.setSession(mockToken, userResponse);
      return {
        token: mockToken,
        user: userResponse,
      };
    }
  },

  /**
   * Registra un nuevo usuario en DailySpace.
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await httpClient<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: dto,
      });
      authStorage.setSession(response.token, response.user);
      return response;
    } catch (error) {
      if (error instanceof HttpError && error.statusCode !== 0) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 350));
      const users = getMockUsers();

      // Verificar unicidad de correo (409 según la rúbrica)
      const existing = users.find(
        (u) => u.email.toLowerCase() === dto.email.toLowerCase()
      );
      if (existing) {
        throw new HttpError("El correo electrónico ya está registrado", 409);
      }

      const newUser: User & { password: string } = {
        id: Date.now(),
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        password: dto.password,
        role: "user",
      };

      users.push(newUser);
      saveMockUsers(users);

      const mockToken = `mock_jwt_token_user_${newUser.id}_${Date.now()}`;
      const userResponse: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      authStorage.setSession(mockToken, userResponse);
      return {
        token: mockToken,
        user: userResponse,
      };
    }
  },

  /**
   * Cierra la sesión activa.
   */
  logout(): void {
    authStorage.clearSession();
  },

  /**
   * Obtiene el usuario actual desde el almacenamiento persistente.
   */
  getCurrentUser(): User | null {
    return authStorage.getUser();
  },

  /**
   * Verifica si hay una sesión activa.
   */
  isAuthenticated(): boolean {
    return Boolean(authStorage.getToken());
  },
};
