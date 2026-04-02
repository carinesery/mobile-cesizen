import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from '@/services';
import { User } from '@/types';

// 	Expo Secure Store suffit
//React Native Keychain

interface AuthContextType {
  user: User | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;  // ✅ C'est async !
  loading: boolean;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);  // ✅ FALSE initialement (pas d'action en cours)
  const [initializing, setInitializing] = useState(true); // Mais initializing est true = checkAuth en cours


  const checkAuth = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        setUser(null);
        return;
      }
      try {
        const response = await authService.getProfile();
        setUser(response);
        console.log("User récupéré du checkAuth avec accès :", response);
      } catch (error: any) {
        // Si erreur d'auth, tente un refresh
        if (error.message && error.message.toLowerCase().includes('token')) {
          try {
            await authService.refreshToken();
            // On retente getProfile
            const response = await authService.getProfile();
            setUser(response);
            console.log("User récupéré après refreshToken :", response);
          } catch (refreshError) {
            // Echec du refresh, on déconnecte
            await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
            setUser(null);
            console.log("Echec du refreshToken, user déconnecté.");
          }
        } else {
          // Autre erreur
          setUser(null);
        }
      }
    } catch (error) {
      console.log("checkAuth erreur :", error);
      setUser(null);
    } finally {
      setInitializing(false); // ✅ Fin du check initial
    }
  };

  // S'exécute au lancement de l'app 
  useEffect(() => {
    checkAuth();
    console.log("User récup :", user);
  }, []);



  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const data = await authService.login({ email, password });
      setUser(data.user);

      // Gère le stockage des tokens car il gère l'état global
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);

    } catch (error: any) {
      console.log("AuthContext reçoit :", error.message);
      throw error; // On remonte/transmet l'erreur 

    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      const refreshToken = await AsyncStorage.getItem("refreshToken");
      

      console.log("RefreshToken :", refreshToken);
      console.log("User avant logout :", user);
      console.log("Appel de logout dans AuthContext");

      await authService.logout();

      setUser(null);

    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, initializing, checkAuth }}>
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