import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router/build/exports";
import { LoadingScreen } from "@/components/LoadingScreen";
import { COLORS, SPACING, DIMENSIONS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { profileService } from "@/services";
import { useRef, useState, useCallback } from "react";

function LongPressDeleteButton() {
  const { logout } = useAuth();
  const [pressing, setPressing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const HOLD_DURATION = 2000;

  const startPress = useCallback(() => {
    setPressing(true);
    progress.setValue(0);
    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_DURATION,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished) {
        handleDelete();
      }
    });
  }, []);

  const releasePress = useCallback(() => {
    setPressing(false);
    if (animRef.current) {
      animRef.current.stop();
    }
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await profileService.deleteAccount();
      await logout();
      Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès.");
      router.replace("/(auth)/login" as any);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de supprimer le compte. Veuillez réessayer.");
      setDeleting(false);
      setPressing(false);
      progress.setValue(0);
    }
  };

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const bgInterpolation = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#FF6B6B', '#FF4444', '#CC0000'],
  });

  return (
    <View style={deleteStyles.container}>
      <Text style={deleteStyles.warningText}>
        Maintenez le bouton pendant 2 secondes pour supprimer votre compte. Cette action est irréversible.
      </Text>
      <TouchableOpacity
        style={deleteStyles.button}
        onPressIn={startPress}
        onPressOut={releasePress}
        activeOpacity={1}
        disabled={deleting}
      >
        <Animated.View
          style={[
            deleteStyles.progressFill,
            {
              width: widthInterpolation,
              backgroundColor: bgInterpolation,
            },
          ]}
        />
        <View style={deleteStyles.buttonContent}>
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          <Text style={deleteStyles.buttonText}>
            {deleting ? 'Suppression...' : pressing ? 'Maintenez...' : 'Supprimer mon compte'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const deleteStyles = StyleSheet.create({
  container: {
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  warningText: {
    fontSize: 12,
    color: COLORS.neutral.gray,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  button: {
    height: 56,
    borderRadius: DIMENSIONS.borderRadius.lg,
    backgroundColor: '#FFE5E5',
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: DIMENSIONS.borderRadius.full,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
});

export default function ProfileScreen() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Vous devez être connecté pour voir votre profil.</Text>
        <TouchableOpacity
          style={[styles.primaryButton, { marginTop: 20 }]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.primaryButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={styles.topSection}>
      {/* Photo de profil */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {user.profilPictureUrl ? (
            <Image source={{ uri: user.profilPictureUrl }} style={styles.avatar} />
          ) : (
            <Ionicons name="person" size={48} color={COLORS.neutral.gray} />
          )}
        </View>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push("/account/profile-edit")}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: '#F1FDFB' }]}>
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Modifier le profil</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.neutral.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push("/account/update-password")}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: '#E3E3FA' }]}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.actionText}>Modifier mon mot de passe</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.neutral.gray} />
        </TouchableOpacity>
      </View>
      </View>

      {/* Suppression du compte — collé en bas */}
      <LongPressDeleteButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E3E3FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  actionsSection: {
    gap: SPACING.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: DIMENSIONS.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: DIMENSIONS.borderRadius.full,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
  },
});