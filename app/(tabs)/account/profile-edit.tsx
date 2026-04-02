import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { profileService } from "@/services";
import { COLORS, SPACING, DIMENSIONS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function UpdateProfileScreen() {
    const { user, refreshUser } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission refusée", "Autorisez l'accès à la galerie.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled || !result.assets?.length) return;

        const asset = result.assets[0];

        if (!asset.type?.startsWith("image")) {
            Alert.alert("Erreur", "Seules les images sont acceptées");
            return;
        }

        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
            Alert.alert("Erreur", "Image trop lourde (max 5MB)");
            return;
        }

        setImage(asset);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);

            if (image) {
                formData.append("profilPicture", {
                    uri: image.uri,
                    name: "profile.jpg",
                    type: "image/jpeg",
                } as any);
            }

            await profileService.updateProfile(formData);

            Alert.alert("Succès", "Profil mis à jour !");

            await refreshUser();
            router.back();

        } catch (err: any) {
            console.log(err);
            setError(err.message || "Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    const currentImageUri = image?.uri || user?.profilPictureUrl;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {error && (
                    <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* Photo de profil */}
                <TouchableOpacity onPress={pickImage} style={styles.avatarSection} activeOpacity={0.8}>
                    <View style={styles.avatarContainer}>
                        {currentImageUri ? (
                            <Image source={{ uri: currentImageUri }} style={styles.avatar} />
                        ) : (
                            <Ionicons name="person" size={48} color={COLORS.neutral.gray} />
                        )}
                        <View style={styles.cameraIcon}>
                            <Ionicons name="camera" size={16} color="#fff" />
                        </View>
                    </View>
                    <Text style={styles.changePhotoText}>Changer la photo</Text>
                </TouchableOpacity>

                {/* Formulaire */}
                <View style={styles.formSection}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Nom d'utilisateur</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={18} color={COLORS.neutral.gray} />
                            <TextInput
                                placeholder="Votre nom d'utilisateur"
                                value={username}
                                onChangeText={setUsername}
                                style={styles.input}
                                placeholderTextColor={COLORS.neutral.gray}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Adresse email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.neutral.gray} />
                            <TextInput
                                placeholder="exemple@email.com"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={COLORS.neutral.gray}
                            />
                        </View>
                    </View>
                </View>

                {/* Bouton */}
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.buttonDisabled]}
                    onPress={handleUpdate}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Enregistrer les modifications</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: SPACING.md,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        padding: SPACING.sm + 4,
        borderRadius: DIMENSIONS.borderRadius.lg,
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    errorText: {
        flex: 1,
        color: COLORS.error,
        fontSize: 13,
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
        overflow: 'hidden',
        marginBottom: SPACING.sm,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    changePhotoText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    formSection: {
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: DIMENSIONS.borderRadius.lg,
        paddingHorizontal: SPACING.sm + 4,
        gap: SPACING.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 14,
        color: COLORS.text,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: DIMENSIONS.borderRadius.full,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});