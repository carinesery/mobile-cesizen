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

  // Interceptor ajoute le token d'authentification
  api.interceptors.request.use(async (config) => {

    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config; // envoi de la requête à l'api
  });

  // Interceptor pour gérer les erreurs d'authentification
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any; // error.config = requête envoyée

      // Si erreur 401 et pas déjà tenté de refresh
      if (error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login')) {

        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');

          if (!refreshToken) {
            return Promise.reject(error); // 👈 on laisse passer l'erreur
          }

          const response = await api!.post('/auth/refresh-token-mobile', {
            refreshToken,
          });
          console.log("Token rafraîchi avec succès :", response.data);

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          await AsyncStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            await AsyncStorage.setItem('refreshToken', newRefreshToken);
          }

          // Réessayer la requête originale
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api!(originalRequest);

        } catch (refreshError) {
          
          // Impossible de refresh, déconnecter l'utilisateur
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');

          return Promise.reject(refreshError);
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
