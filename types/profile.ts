/**
 * Types pour le profil utilisateur
 */

import { User } from './auth';

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  profilPictureUrl?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ProfileContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  updatePassword: (data: UpdatePasswordRequest) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  clearError: () => void;
}
