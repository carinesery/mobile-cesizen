/**
 * Services pour les articles
 */

import { getAPI } from './api';
import { Article } from '../types/index';

const api = getAPI();

export const articleService = {
  /**
   * Récupère tous les articles
   */
  async getAllArticles(): Promise<Article[]> {
    try {
      const response = await api.get<Article[]>('/articles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupère un article par son slug
   */
  async getArticleBySlug(slug: string): Promise<Article> {
    try {
      const response = await api.get<Article>(`/articles/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default articleService;
