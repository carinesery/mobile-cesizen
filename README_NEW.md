# CESIZen Mobile - Application React Native

Application React Native TypeScript pour la plateforme CESIZen - Gestion des émotions et bien-être.

## ✨ Fonctionnalités

- ✅ **Authentification**: Login, Register, Forgot Password, Reset Password
- ✅ **Profil Utilisateur**: View, Edit, Change Password, Delete Account
- ✅ **Articles**: Lister et consulter les articles
- ✅ **Journal des Émotions**: Créer, modifier, supprimer des entrées
- ✅ **Statistiques**: Visualiser les statistiques par période (semaine/mois/année)
- ✅ **Design Responsive**: Interface adaptée aux appareils mobiles
- ✅ **Charte Graphique**: Respecte le design de CESIZen

## 🎯 Stack Technologique

- **React Native** avec Expo
- **TypeScript** pour la sécurité des types
- **React Navigation** (Bottom Tabs + Stack)
- **Context API** pour la gestion d'état
- **Axios** pour les requêtes API
- **AsyncStorage** pour le stockage local
- **Zod** pour la validation

## 🚀 Démarrage Rapide

### 1. Installation

```bash
cd mobile-cesizen
npm install
```

### 2. Configuration

Créer et configurer le fichier `.env`:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Démarrer l'app

```bash
npm run dev
# Scannez le QR code avec Expo Go
```

### Pour iOS/Android:

```bash
npm run ios     # iOS
npm run android # Android
```

## 📁 Structure du Projet

```
src/
├── screens/        # Tous les écrans de l'app
├── components/     # Composants réutilisables
├── context/        # Contextes React
├── services/       # Services API
├── navigation/     # Configuration de navigation
├── types/         # Types TypeScript
└── constants/     # Constantes et thème
```

## 🎨 Charte Graphique

### Couleurs
- **Primaire**: #BE51FF (Purple)
- **Teal**: #06090A
- **Cyan**: #43C0C3
- **Secondaires**: Rose, Corail, Vert, Jaune

### Typographie
- **Police**: Nunito Sans
- **Titres**: 24px, Bold
- **Corps**: 16px, Regular

## 🔌 API Backend

L'app se connecte à l'API du backend (`backend-cesizen`):

```
http://localhost:3000/api
```

### Endpoints clés:
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `GET /articles` - Lister articles
- `GET /mood-entries` - Journal émotions
- `GET /stats?period=week` - Statistiques

## 📜 Écrans Implémentés

### Authentification
- **LoginScreen** - Connexion utilisateur
- **RegisterScreen** - Création de compte
- **ForgotPasswordScreen** - Réinitialisation du mot de passe

### Utilisateur Authentifié
- **HomeScreen** - Accueil avec widgets
- **ArticlesScreen** - Liste des articles
- **ArticleDetailScreen** - Détail d'un article
- **MoodJournalScreen** - Journal des émotions
- **AddEditMoodEntryScreen** - Ajouter/Éditer une entrée
- **StatsScreen** - Statistiques par période
- **ProfileScreen** - Gestion du profil

## 🔐 Authentification

### Login Flow
1. Utilisateur entre ses identifiants
2. API retourne `accessToken` et `refreshToken`
3. Tokens stockés dans `AsyncStorage`
4. Utilisateur redirigé vers HomeScreen

### Token Refresh
- Chaque requête ajoute le token dans le header
- Si 401 → Refresh token automatique
- Si échec → Redirection vers Login

### Logout
- Suppression des tokens
- Retour à l'écran de connexion

## 🛠️ Commandes de Développement

```bash
# Démarrer en développement
npm run dev

# Build pour production
npm run build

# Lint
npm run lint

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 Compatibilité

- **iOS**: 12.0+
- **Android**: API 21+
- **Web**: Modern browsers

## 🔧 Configuration

### Dépendances Principales

```json
{
  "expo": "^52.0.0",
  "react-native": "^0.76.0",
  "@react-navigation/native": "^7.0.0",
  "@react-navigation/bottom-tabs": "^7.1.0",
  "axios": "^1.7.0",
  "zod": "^3.24.0"
}
```

## 🚀 Déploiement

### Préparation

1. Mettre à jour la version dans `app.json`
2. Configurer l'API URL de production dans `.env`
3. Tester sur les deux plateformes

### Build Android

```bash
eas build --platform android
```

### Build iOS

```bash
eas build --platform ios
```

## 👨‍💻 Guide de Contribution

1. Créer une branche: `git checkout -b feature/ma-feature`
2. Commit les changements: `git commit -m "Add ma-feature"`
3. Push: `git push origin feature/ma-feature`
4. Ouvrir une Pull Request

## 📖 Documentation Additionnelle

- [GETTING_STARTED.md](GETTING_STARTED.md) - Guide détaillé de démarrage
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)

## 📞 Support

Pour les problèmes de développement, consultez:
- Le dossier `backend-cesizen/` pour l'API
- La documentation d'Expo
- Les issues GitHub du projet

---

**Développé avec ❤️ pour CESIZen**
