import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { articleService } from '@/services';
import { Article } from '@/types';
import axios from 'axios';

interface ArticleContextType {
    error: string | null;
    loading: boolean;
    articles: Article[];
    quote: { q: string; a: string } | null;
    translatedQuote: string;
    loadingQuote: boolean;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [quote, setQuote] = useState<{ q: string; a: string } | null>(null);
    const [translatedQuote, setTranslatedQuote] = useState('');
    const [loadingQuote, setLoadingQuote] = useState(false);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const data = await articleService.getAllArticles();
            setArticles(data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erreur lors du chargement des articles';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchQuoteAndTranslate = async () => {
        try {
            setLoadingQuote(true);
            const response = await axios.get('https://zenquotes.io/api/random', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            console.log('zenquotes raw:', JSON.stringify(response.data));
            
            const quoteData = Array.isArray(response.data) ? response.data[0] : response.data;
            if (!quoteData?.q) {
                console.error('Quote data invalide:', quoteData);
                return;
            }
            setQuote(quoteData);

            const translationResponse = await axios.get('https://api.mymemory.translated.net/get', {
                params: {
                    q: quoteData.q,
                    langpair: 'en|fr'
                }
            });
            console.log('traduction:', JSON.stringify(translationResponse.data.responseData));
            setTranslatedQuote(translationResponse.data.responseData.translatedText);
        } catch (error: any) {
            console.error('Erreur citation/traduction:', error.message);
        } finally {
            setLoadingQuote(false);
        }
    };

    useEffect(() => {
        fetchArticles();
        fetchQuoteAndTranslate();
    }, []);

    return (
        <ArticleContext.Provider value={{ loading, error, articles, quote, translatedQuote, loadingQuote }}>
            {children}
        </ArticleContext.Provider>
    );
};

export const useArticles = () => {
    const context = useContext(ArticleContext);
    if (context === undefined) {
        throw new Error('Aucun article trouvé dans le contexte');
    }
    return context;
};