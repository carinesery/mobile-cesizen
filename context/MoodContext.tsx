/**
 * Contexte pour les émotions et le journal des émotions
 */

import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { Emotion, MoodEntry, CreateMoodEntryRequest, UpdateMoodEntryRequest, MoodContextType } from '../types/mood';
import { emotionService, moodEntryService } from '../services/moodService';

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<MoodEntry | null>(null);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await moodEntryService.getAllMoodEntries();
      setEntries(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement des entrées';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEntryById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await moodEntryService.getMoodEntryById(id);
      setCurrentEntry(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement de l\'entrée';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEmotions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await emotionService.getAllEmotions();
      setEmotions(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement des émotions';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEntry = useCallback(async (data: CreateMoodEntryRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const newEntry = await moodEntryService.createMoodEntry(data);
      setEntries((prev) => [newEntry, ...prev]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de l\'entrée';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateEntry = useCallback(async (id: string, data: UpdateMoodEntryRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedEntry = await moodEntryService.updateMoodEntry(id, data);
      setEntries((prev) =>
        prev.map((entry) => (entry.idMoodEntry === id ? updatedEntry : entry))
      );
      if (currentEntry?.idMoodEntry === id) {
        setCurrentEntry(updatedEntry);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour de l\'entrée';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentEntry]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await moodEntryService.deleteMoodEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.idMoodEntry !== id));
      if (currentEntry?.idMoodEntry === id) {
        setCurrentEntry(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression de l\'entrée';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentEntry]);

  const clearCurrentEntry = useCallback(() => {
    setCurrentEntry(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: MoodContextType = {
    entries,
    currentEntry,
    emotions,
    isLoading,
    error,
    fetchEntries,
    fetchEntryById,
    fetchEmotions,
    createEntry,
    updateEntry,
    deleteEntry,
    clearCurrentEntry,
    clearError,
  };

  return (
    <MoodContext.Provider value={value}>{children}</MoodContext.Provider>
  );
};

export const useMood = (): MoodContextType => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

export default MoodContext;
