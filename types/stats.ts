/**
 * Types pour les statistiques
 * Alignés sur la réponse du backend GET /stats?period=week|month|year
 */

export type StatsPeriod = 'week' | 'month' | 'year';

// Chaque émotion dans le tableau intensityByEmotion
export interface EmotionStat {
  emotionId: string;
  label: string;       // Le titre de l'émotion (ex: "Joie")
  count: number;       // Nombre de fois logguée dans la période
  avgIntensity: number; // Intensité moyenne (0-10, 2 décimales)
}

// La réponse complète du backend
export interface StatsData {
  totalEntries: number;
  intensityByEmotion: EmotionStat[];
  mostFrequent: EmotionStat | null;   // L'émotion la plus fréquente
  leastFrequent: EmotionStat | null;  // L'émotion la moins fréquente
  evolutionByDay: {
    date: string;          // YYYY-MM-DD
    avgIntensity: number;
  }[];
}

export interface StatsContextType {
  stats: StatsData | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: (period: StatsPeriod) => Promise<void>;
  clearError: () => void;
}
