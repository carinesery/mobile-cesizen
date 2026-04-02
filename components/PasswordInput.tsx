import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, DIMENSIONS } from "@/constants/theme";

export default function PasswordInput({ value, onChangeText, placeholder }: any) {
    const [secureText, setSecureText] = useState(true);

    return (
        <View style={styles.container}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.neutral.gray} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureText}
                placeholderTextColor={COLORS.neutral.gray}
            />
            <TouchableOpacity
                onPress={() => setSecureText(prev => !prev)}
                style={styles.icon}
            >
                <Ionicons
                    name={secureText ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.neutral.gray}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#F6F6F6',
        borderRadius: DIMENSIONS.borderRadius.lg,
        paddingHorizontal: SPACING.sm + 4,
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 14,
        color: COLORS.text,
    },
    icon: {
        padding: 4,
    },
});