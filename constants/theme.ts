/**
 * Couleurs de la charte graphique CESIZen
 * Basées sur la maquette fournie
 */

// Couleurs simples et directement utilisables
export const COLORS = {
  primary: '#BE51FF',         // Violet principal
  secondary: '#C29FE9',       // Violet secondaire
  accent: '#43C0C3',          // Cyan/Teal
  text: '#333333',            // Texte sombre
  textLight: '#666666',       // Texte léger
  border: '#EEEEEE',          // Bordures
  background: '#FFFFFF',      // Fond
  success: '#43C0C3',         // Succès
  error: '#FF6B6B',           // Erreur
  warning: '#FED95D',         // Attention
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: '#999999',
    darkGray: '#666666',
    borderGray: '#EEEEEE',
  },
  status: {
    success: '#43C0C3',
    error: '#FF6B6B',
    warning: '#FED95D',
    info: '#43C0C3',
  },
};

// Palettes complètes si besoin de couleurs alternatives
export const PALETTES = {
  primary: {
    darkBlue: '#364153',
    slateGray: '#6A7282',
    teal: '#06090A',
    purple: '#BE51FF',
    lightBlue: '#BE51FF',
    cyan: '#43C0C3',
  },
  pastel: {
    lightTeal: '#CCF0E8',
    lightCyan: '#CCFCE8',
    lightPink: '#F3E8FF',
    white: '#FFFFFF',
    lightGray: '#FFFFFF',
    lightCyan2: '#E1FFDB',
  },
  secondary: {
    pink: '#FCB1FC',
    purple: '#C29FE9',
    coral: '#FFB75',
    lightBlue: '#89C9EF',
    green: '#B8E083',
    yellow: '#FED95D',
  },
};

/**
 * Typographie - fontWeight doit être un nombre ou 'bold'/'normal'
 */
export const TYPOGRAPHY = {
  title: {
    fontSize: 24,
    fontFamily: 'Nunito Sans',
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito Sans',
    fontWeight: 600 as any,  // React Native accepte 100-900
  },
  body: {
    fontSize: 16,
    fontFamily: 'Nunito Sans',
    fontWeight: 'normal' as const,
  },
  small: {
    fontSize: 14,
    fontFamily: 'Nunito Sans',
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Nunito Sans',
    fontWeight: 'normal' as const,
  },
};

/**
 * Espacement
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Dimensions
 */
export const DIMENSIONS = {
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.85:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
