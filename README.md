# CESIZen Mobile

Application **React Native + TypeScript** pour CESIZen - Plateforme de bien-être et gestion des émotions.

![CESIZen](https://img.shields.io/badge/CESIZen-Mobile-purple)
![React Native](https://img.shields.io/badge/React%20Native-0.76-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Expo](https://img.shields.io/badge/Expo-52-black)

## ✨ Fonctionnalités Principales

- ✅ **Authentification complète**: Login, Register, Forgot Password, Reset Password, Delete Account
- ✅ **Gestion du profil**: Voir, modifier, changer le mot de passe
- ✅ **Articles**: Consulter la liste et les détails
- ✅ **Journal des émotions**: Créer, modifier, supprimer des entrées
- ✅ **Statistiques**: Visualiser par période (semaine/mois/année)
- ✅ **Design responsif**: Interface optimisée pour mobile
- ✅ **Charte graphique CESIZen**: Couleurs et typographie officielles

## 🚀 Démarrage Rapide

### 1️⃣ Installation

```bash
npm install
```

### 2️⃣ Configuration

```bash
cp .env.example .env
# Configurer EXPO_PUBLIC_API_URL
```

### 3️⃣ Lancer le développement

```bash
npm run dev
# Scannez le QR code avec Expo Go
```

### Autres builds:
```bash
npm run ios       # iOS
npm run android   # Android
npm run web       # Web
npm run build     # Build pour production
```

## 📁 Structure du Projet

```
src/
├── screens/          # 10 écrans (Login, Home, Profile, Articles, Mood, Stats, etc.)
├── components/       # Composants réutilisables (Button, TextInput, Header, etc.)
├── context/          # 5 contextes React (Auth, Profile, Articles, Mood, Stats)
├── services/         # Services API pour chaque entité
├── navigation/       # Navigation (Root, Auth, App avec BottomTabs)
├── types/           # Types TypeScript pour tout l'app
├── constants/       # Thème, couleurs, textes (FR + EN)
├── app.tsx          # Point d'entrée avec tous les providers
└── index.ts         # Export Expo
```

## 🎨 Design & Charte

L'app respecte **100%** la charte graphique CESIZen:

### 🎯 Couleurs Primaires
- **#BE51FF** - Purple (Primaire)
- **#06090A** - Teal
- **#43C0C3** - Cyan

### 🎨 Couleurs Secondaires
- **#FCB1FC** - Rose
- **#FFB75** - Corail  
- **#B8E083** - Vert
- **#FED95D** - Jaune

### 📝 Typographie
- Police: **Nunito Sans**
- Titres: 24px, Bold
- Corps: 16px, Regular

## 📱 Écrans Implémentés (10)

### 🔐 Authentification (3 écrans)
- `LoginScreen` - Connexion
- `RegisterScreen` - Inscription
- `ForgotPasswordScreen` - Réinitialisation du mot de passe

### 📱 Écrans Utilisateur (7 écrans)
- `HomeScreen` - Accueil avec bienvenue et articles populaires
- `ArticlesScreen` - Liste complète des articles
- `ArticleDetailScreen` - Détail d'un article
- `MoodJournalScreen` - Journal des émotions avec liste
- `AddEditMoodEntryScreen` - Formulaire ajouter/éditer entrée
- `StatsScreen` - Statistiques par période
- `ProfileScreen` - Gestion du profil utilisateur

## 🔌 Intégration Backend

L'app communique avec **backend-cesizen** via:

```
API Base URL: http://localhost:3000/api
```

### Endpoints utilisés:
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription  
- `GET /profile` - Récupérer profil
- `PATCH /profile` - Modifier profil
- `GET /articles` - Lister articles
- `GET /articles/:slug` - Détail article
- `GET /mood-entries` - Lister entrées
- `POST /mood-entries` - Créer entrée
- `GET /stats?period=week` - Statistiques

## 🏗️ Architecture

### État Global (5 Contextes)
1. **AuthContext** - Authentification utilisateur
2. **ProfileContext** - Profil et gestion de compte
3. **ArticlesContext** - Articles et détails
4. **MoodContext** - Entrées émotions et liste
5. **StatsContext** - Statistiques

### Services API
- `authService` - Authentification
- `profileService` - Profil utilisateur
- `articleService` - Articles
- `moodService` - Émotions et entries
- `statsService` - Statistiques
- `api.ts` - Client Axios centralisé avec intercepteurs

### Navigation
- **RootNavigator**: Gère l'authentification vs app
- **AuthNavigator**: Stack pour Login/Register/ForgotPassword
- **AppNavigator**: Bottom Tabs pour Home/Articles/Mood/Stats

## 🔐 Authentification

### 🔑 Flow
1. Login → API retourne tokens
2. Tokens stockés dans `AsyncStorage`
3. Intercepteur Axios ajoute token à chaque requête
4. Si 401 → Refresh token automatique
5. Logout → Suppression tokens

## 🛠️ Stack Technologique

```json
{
  "react": "^18.3.1",
  "react-native": "^0.76.0",
  "expo": "^52.0.0",
  "@react-navigation/native": "^7.0.0",
  "@react-navigation/bottom-tabs": "^7.1.0",
  "@react-navigation/stack": "^7.0.0",
  "typescript": "^5.4.0",
  "axios": "^1.7.0",
  "zod": "^3.24.0",
  "@react-native-async-storage/async-storage": "^1.23.1"
}
```

## 📖 Documentation Complète

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Guide détaillé d'installation et configuration
- **[app.json](app.json)** - Configuration Expo
- **[tsconfig.json](tsconfig.json)** - Configuration TypeScript
- **[babel.config.js](babel.config.js)** - Configuration Babel

## 💻 Commandes de Développement

```bash
npm run dev         # Démarrer en développement
npm run ios         # Lancer sur iOS
npm run android     # Lancer sur Android
npm run web         # Lancer sur web
npm run build       # Build pour production
npm run lint        # Lancer le linter
```

## 📦 Structure des Fichiers

```
mobile-cesizen/
├── src/
│   ├── screens/              (10 écrans)
│   ├── components/           (6 composants)
│   ├── context/              (5 contextes)
│   ├── services/             (6 services)
│   ├── navigation/           (3 navigateurs)
│   ├── types/                (6 fichiers types)
│   ├── constants/            (2 fichiers constants)
│   ├── app.tsx               (App principale)
│   └── index.ts              (Point d'entrée)
├── config files (tsconfig, babel, etc.)
├── GETTING_STARTED.md        (Guide complet)
└── README.md                 (Ce fichier)
```

## 🚀 Déploiement

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

Voir [GETTING_STARTED.md](GETTING_STARTED.md) pour plus de détails.

## ✅ Checklist Implémentation

- ✅ Configuration Expo + TypeScript
- ✅ Client API avec Axios
- ✅ 5 Contextes React
- ✅ 10 Écrans complets
- ✅ 6 Composants réutilisables
- ✅ Navigation complète (Stack + Tabs)
- ✅ Authentification JWT
- ✅ Charte graphique respectée
- ✅ Gestion d'erreurs
- ✅ Types TypeScript stricts
- ✅ Stockage local des tokens
- ✅ Multilangue (FR/EN)

## 🐛 Troubleshooting

### L'app ne se connecte pas à l'API
- Vérifier que le backend est en cours: `npm run dev` dans `backend-cesizen/`
- Vérifier l'URL de l'API dans `.env`

### Module not found
```bash
npm install
npm run dev
```

### Erreur TypeScript
```bash
npx tsc --noEmit
```

## 📚 Ressources

- [React Native](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript](https://www.typescriptlang.org/)

## 📝 Conventions de Code

- **Composants**: PascalCase + `.tsx`
- **Écrans**: `*Screen.tsx`
- **Services**: `*Service.ts`
- **Types**: `src/types/*.ts`
- **Imports**: Utiliser les alias `@screens`, `@components`, `@services`, etc.

## 📞 Support

Pour toute question:
- Consulter [GETTING_STARTED.md](GETTING_STARTED.md)
- Vérifier [backend-cesizen/](../backend-cesizen/)
- Lire la documentation officielle d'Expo

---

**Développé avec ❤️ pour CESIZen**

Version: 1.0.0  
Dernière mise à jour: 28 Mars 2026
