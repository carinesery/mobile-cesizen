import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ou autre pack d’icônes

export default function PasswordInput({ value, onChangeText, placeholder }: any) {
    const [secureText, setSecureText] = useState(true);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureText} // important
            />
            <TouchableOpacity
                onPress={() => setSecureText(prev => !prev)}
                style={styles.icon}
            >
                <Ionicons
                    name={secureText ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        padding: 10,
    },
    icon: {
        padding: 10,
    },
});