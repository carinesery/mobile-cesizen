/**
 * Services d'authentification
 */

import { getAPI } from './api';
import { LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = getAPI();

export const authService = {
  /**
   * Connecte un utilisateur
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login-mobile', credentials);

      // On ne stocke plus les tokens à ce niveau ?????

      return response.data;

    } catch (error: any) { // Erreur du backend 
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/profile');
      return response.data;
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },


  /**
   * Inscrit un nouvel utilisateur
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('termsConsent', String(data.termsConsent));
      formData.append('privacyConsent', String(data.privacyConsent));

      const response = await api.post<LoginResponse>('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { accessToken, refreshToken } = response.data;

      // Stocker les tokens
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Demande la réinitialisation du mot de passe
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await api.post('/auth/forgot-password', data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Réinitialise le mot de passe
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await api.post('/auth/reset-password', data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirme l'email de l'utilisateur
   */
  async confirmEmail(token: string): Promise<void> {
    try {
      await api.get(`/auth/confirm-email?token=${token}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Accepte les conditions légales
   */
  async acceptLegal(termsConsent: boolean, privacyConsent: boolean): Promise<void> {
    try {
      await api.post('/auth/accept-legal', {
        termsConsent,
        privacyConsent,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Supprimer les tokens même si la requête échoue
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    }
  },

  /**
   * Rafraîchit le token d'accès
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<{ accessToken: string; refreshToken: string }>(
        '/auth/refresh-token',
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Mettre à jour les tokens
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);

      return accessToken;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
