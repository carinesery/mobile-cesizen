import React, { ReactNode, createContext, useContext, useState, useEffect, Children } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from '@/services';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au démarrage de l'application
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      // Penser à récupérer l'accesstoken et le refreshtoekn pour Asynctorage
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      
      // Suppression du refreshTokenet de l'accessToken de AsyncStorage
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");

      setUser(null);

    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Contexte d'authentification
 */

// import React, { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { User, LoginRequest, RegisterRequest, ResetPasswordRequest, AuthContextType } from '../types/auth';
// import authService from '../services/authService';
// import profileService from '../services/profileService';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Vérifier si l'utilisateur est connecté au démarrage
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const accessToken = await AsyncStorage.getItem('accessToken');
//         if (accessToken) {
//           // Récupérer le profil de l'utilisateur
//           const profile = await profileService.getProfile();
//           setUser(profile);
//         }
//       } catch (err) {
//         console.error('Auth check failed:', err);
//         await AsyncStorage.removeItem('accessToken');
//         await AsyncStorage.removeItem('refreshToken');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = useCallback(async (credentials: LoginRequest) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await authService.login(credentials);
//       setUser(response.user);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 'Erreur de connexion';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const register = useCallback(async (data: RegisterRequest) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await authService.register(data);
//       setUser(response.user);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 'Erreur d\'inscription';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       await authService.logout();
//       setUser(null);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 'Erreur de déconnexion';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const forgotPassword = useCallback(async (email: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       await authService.forgotPassword({ email });
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 'Erreur lors de la demande';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       await authService.resetPassword(data);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 'Erreur de réinitialisation';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   const value: AuthContextType = {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     error,
//     login,
//     register,
//     logout,
//     forgotPassword,
//     resetPassword,
//     clearError,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;
