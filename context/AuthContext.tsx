import React, { ReactNode, createContext, useContext, useState, useEffect, Children } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from '@/services';
import { User } from '@/types';

// 	Expo Secure Store suffit
//React Native Keychain

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

// /////////// FAKE USER POUR TESTS //////////
// interface FakeUser {
//   email: 'admin@test.com',
//   password: 'Admin@123',
//   createdAt: '2024-06-01T12:00:00Z',
//   updatedAt: null,
//   id: 'jdvlbdsqj:fs',
//   username: 'SuperAdmin',
//   isActive: true,
//   role: "ADMIN"
// }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken) {
          // Optionnel : vérifier la validité du token côté API
          const response = await authService.getProfile(); // un call pour récupérer le user
          setUser(response.user);
        }
      } catch (err) {
        console.log("Utilisateur non connecté ou token invalide", err);
        setUser(null);
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {

      const data = await authService.login({ email, password });
      setUser(data.user);
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);

      console.log("Login réussi :", data);
      // const fakeUser: FakeUser = {
      //   email: 'admin@test.com',
      //   password: 'Admin@123',
      //   createdAt: '2024-06-01T12:00:00Z',
      //   updatedAt: null,
      //   id: 'jdvlbdsqj:fs',
      //   username: 'SuperAdmin',
      //   isActive: true,
      //   role: "ADMIN"
      // };
      // setUser(fakeUser);

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
    <AuthContext.Provider value={{ user, login, logout, loading, error, clearError }}>
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
