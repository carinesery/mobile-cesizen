/**
 * Types pour l'authentification
 */

export type ROLE = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  username: string;
  profilPictureUrl?: string;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
  role: ROLE;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  profilPictureUrl?: string;
  termsConsent: boolean;
  privacyConsent: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  clearError: () => void;
}
