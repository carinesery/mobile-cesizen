import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
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

export default function UpdateProfileScreen() {
    const { user, refreshUser } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pré-remplir les champs
    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [user]);

    // ==== IMAGE PICKER ====
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

        // Vérification type
        if (!asset.type?.startsWith("image")) {
            Alert.alert("Erreur", "Seules les images sont acceptées");
            return;
        }

        // Vérification taille
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
            Alert.alert("Erreur", "Image trop lourde (max 5MB)");
            return;
        }

        setImage(asset);
    };

    // ==== SUBMIT ====
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

            await refreshUser(); // recharge user context
            router.back();

        } catch (err: any) {
            console.log(err);
            setError(err.message || "Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Modifier mon profil</Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* IMAGE */}
                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image.uri }} style={styles.image} />
                    ) : user?.profilPictureUrl ? (
                        <Image source={{ uri: user.profilPictureUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={{ color: "#007AFF" }}>Choisir une image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* USERNAME */}
                <TextInput
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />

                {/* EMAIL */}
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                    <Button title="Mettre à jour" onPress={handleUpdate} />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
});