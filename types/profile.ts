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
