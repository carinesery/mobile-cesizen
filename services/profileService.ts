/**
 * Services de profil utilisateur
 */

import { getAPI } from './api';
import { User, UpdateProfileRequest, UpdatePasswordRequest } from '../types/index';

const api = getAPI();

export const profileService = {
  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Met à jour le profil de l'utilisateur
   */
  async updateProfile(data: UpdateProfileRequest | FormData): Promise<User> {
    try {
      // Ne pas forcer le header Content-Type, laisser axios le gérer
      const response = await api.patch<User>('/profile', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      throw new Error(message);
    }
  },

  /**
   * Change le mot de passe de l'utilisateur
   */
  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    try {
      await api.patch('/profile/password', data);

    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },

  /**
   * Supprime le compte de l'utilisateur
   */
  async deleteAccount(): Promise<void> {
    try {
      await api.delete('/auth/logout');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },
};

export default profileService;
