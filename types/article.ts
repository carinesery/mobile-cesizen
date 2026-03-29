/**
 * Types pour les articles
 */

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  presentationImageUrl?: string;
  status: ArticleStatus;
  categories?: { title: string, slug: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesContextType {
  articles: Article[];
  currentArticle: Article | null;
  isLoading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
  fetchArticleBySlug: (slug: string) => Promise<void>;
  clearCurrentArticle: () => void;
  clearError: () => void;
}
