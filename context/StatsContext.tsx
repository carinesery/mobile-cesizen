import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { StatsData, StatsPeriod, StatsContextType } from '../types/stats';
import statsService from '../services/statsService';

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (period: StatsPeriod) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await statsService.getStats(period);
      setStats(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement des statistiques';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: StatsContextType = {
    stats,
    isLoading,
    error,
    fetchStats,
    clearError,
  };

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
};

export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

export default StatsContext;
