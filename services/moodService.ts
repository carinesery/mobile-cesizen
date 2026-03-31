/**
 * Services pour les émotions et le journal des émotions
 * Endpoints : GET/POST /mood-entries, GET/PATCH/DELETE /mood-entries/:id
 *             GET /emotions (admin-only pour le CRUD, mais GET accessible aux users)
 */

import { getAPI } from './api';
import { Emotion, MoodEntry, CreateMoodEntryRequest, UpdateMoodEntryRequest } from '../types/index';

export const emotionService = {
  async getAllEmotions(): Promise<Emotion[]> {
    const response = await getAPI().get('/emotions');
    // Le backend peut renvoyer { data: [...] } ou directement [...]
    return response.data.data ?? response.data;
  },

  async getEmotionById(id: string): Promise<Emotion> {
    const response = await getAPI().get(`/emotions/${id}`);
    return response.data.data ?? response.data;
  },
};

export const moodEntryService = {
  async getAllMoodEntries(): Promise<MoodEntry[]> {
    const response = await getAPI().get('/mood-entries');
    return response.data.data ?? response.data;
  },

  async getMoodEntryById(id: string): Promise<MoodEntry> {
    const response = await getAPI().get(`/mood-entries/${id}`);
    return response.data.data ?? response.data;
  },

  async createMoodEntry(data: CreateMoodEntryRequest): Promise<MoodEntry> {
    const response = await getAPI().post('/mood-entries', data);
    // Le backend renvoie { moodEntry: {...}, message: "..." }
    return response.data.moodEntry ?? response.data.data ?? response.data;
  },

  async updateMoodEntry(id: string, data: UpdateMoodEntryRequest): Promise<MoodEntry> {
    const response = await getAPI().patch(`/mood-entries/${id}`, data);
    return response.data.data ?? response.data;
  },

  async deleteMoodEntry(id: string): Promise<void> {
    await getAPI().delete(`/mood-entries/${id}`);
  },
};

export default { emotionService, moodEntryService };
