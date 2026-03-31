/**
 * Services pour les statistiques
 */

import { getAPI } from './api';
import { StatsData, StatsPeriod } from '../types/index';

export const statsService = {
  async getStats(period: StatsPeriod): Promise<StatsData> {
    const response = await getAPI().get('/stats', {
      params: { period },
    });
    return response.data.data ?? response.data;
  },
};

export default statsService;
