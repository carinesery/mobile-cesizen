/**
 * Types pour les émotions et le journal des émotions
 * Alignés sur le backend : Emotion (LEVEL_1 = émotion principale, LEVEL_2 = nuance/feeling)
 */

export type EmotionLevel = 'LEVEL_1' | 'LEVEL_2';

export interface Emotion {
  idEmotion: string;
  title: string;
  description?: string;
  level: EmotionLevel;
  iconUrl?: string;
  parentEmotionId?: string;
  parentEmotion?: Emotion;
  childEmotions?: Emotion[];   // Les nuances (LEVEL_2) d'une émotion principale
  deletedAt?: string;
}

export interface MoodEntry {
  idMoodEntry: string;
  emotionDate: string;           // Date au format ISO (normalisée UTC midnight)
  parentEmotionIntensity: number; // 1-10
  comment?: string;              // Max 500 chars (s'appelle "comment" dans le backend, pas "notes")
  createdAt: string;
  updatedAt?: string;
  userId: string;
  emotionId: string;
  emotion?: Emotion;             // L'émotion principale (LEVEL_1)
  feelingId?: string;
  feeling?: Emotion; 
  iconUrl?: string;            // La nuance (LEVEL_2), optionnelle
}

export interface CreateMoodEntryRequest {
  emotionId: string;              // CUID d'une émotion LEVEL_1
  emotionDate?: string;           // Optionnel : par défaut aujourd'hui
  parentEmotionIntensity: number; // 1-10
  feelingId?: string;             // CUID d'une émotion LEVEL_2 (enfant de emotionId)
  comment?: string;               // Max 500 chars
}

export interface UpdateMoodEntryRequest {
  emotionId?: string;
  emotionDate?: string;
  parentEmotionIntensity?: number;
  feelingId?: string | null;      // null = supprimer la nuance
  comment?: string | null;        // null = supprimer le commentaire
}

export interface MoodContextType {
  entries: MoodEntry[];
  currentEntry: MoodEntry | null;
  emotions: Emotion[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  fetchEntryById: (id: string) => Promise<void>;
  fetchEmotions: () => Promise<void>;
  createEntry: (data: CreateMoodEntryRequest) => Promise<void>;
  updateEntry: (id: string, data: UpdateMoodEntryRequest) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  clearCurrentEntry: () => void;
  clearError: () => void;
}
