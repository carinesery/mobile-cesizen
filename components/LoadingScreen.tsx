import { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';

type Props = {
    message?: string;
};

export const LoadingScreen = ({ message = 'Chargement...' }: Props) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/lotus.png')}
                style={[styles.lotus, { opacity }]}
                resizeMode="contain"
            />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
    },
    lotus: {
        width: 60,
        height: 60,
        marginBottom: SPACING.md,
    },
    message: {
        fontSize: 15,
        color: COLORS.neutral.gray,
        fontWeight: '500',
    },
});
