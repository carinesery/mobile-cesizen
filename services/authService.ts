/**
 * Services d'authentification
 */

import { getAPI } from './api';
import { LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, User } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getApi = () => getAPI();

export const authService = {
  /**
   * Connecte un utilisateur
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await getApi().post<LoginResponse>('/auth/login-mobile', credentials);

      // On ne stocke plus les tokens à ce niveau ?????

      return response.data;

    } catch (error: any) { // Erreur du backend 
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },

  async getProfile() {
    try {
      const response = await getApi().get('/profile');
      return response.data;

    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },


  /**
   * Inscrit un nouvel utilisateur
   */
  async register(data: RegisterRequest | FormData): Promise<User> {
    try {

      const response = await getApi().post<User>('/auth/register-mobile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const user = response.data;
      console.log("Utilisateur enregistré :", user);

      return user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },

  /**
   * Demande la réinitialisation du mot de passe
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await getApi().post('/auth/forgot-password', data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },

  /**
   * Réinitialise le mot de passe
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await getApi().post('/auth/reset-password', data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirme l'email de l'utilisateur
   */
  async confirmEmail(token: string): Promise<void> {
    try {
      await getApi().get(`/auth/confirm-email?token=${token}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
    }
  },

  /**
   * Accepte les conditions légales
   */
  async acceptLegal(termsConsent: boolean, privacyConsent: boolean): Promise<void> {
    try {
      await getApi().post('/auth/accept-legal', {
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
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      await getApi().post('/auth/logout-mobile', { refreshToken });
    } catch (error:any) {
      const message = error.response?.data?.message || 'Erreur de connexion';

      throw new Error(message);
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

      const response = await getApi().post<{ accessToken: string; refreshToken: string }>(
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
