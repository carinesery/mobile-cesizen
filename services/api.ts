/**
 * Client API centralisé
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/theme';

let api: AxiosInstance = null as any;

export const initializeAPI = (): AxiosInstance => {
  api = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
  });

  // Intercepteur pour ajouter le token d'authentification
  api.interceptors.request.use(async (config) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  });

  // Intercepteur pour gérer les erreurs d'authentification
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // Si erreur 401 et pas déjà tenté de refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await api!.post('/auth/refresh-token', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);

          // Réessayer la requête originale
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api!(originalRequest);
        } catch (refreshError) {
          // Impossible de refresh, déconnecter l'utilisateur
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          throw refreshError;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export const getAPI = (): AxiosInstance => {
  if (!api) {
    return initializeAPI();
  }
  return api;
};

export default api;
