import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
}

export default function GlassView({ children, style, intensity = 20 }: GlassViewProps) {
    if (Platform.OS === 'android') {
        // Android often struggles with real-time blur overlays, so we fallback to a semi-transparent white
        return (
            <View style={[styles.androidGlass, style]}>
                {children}
            </View>
        );
    }

    return (
        <BlurView intensity={intensity} style={[styles.glass, style]} tint="light">
            {children}
        </BlurView>
    );
}

const styles = StyleSheet.create({
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        overflow: 'hidden',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
    },
    androidGlass: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Higher opacity for Android to mimic the solid glass look
        borderColor: 'rgba(230, 230, 230, 0.5)',
        borderWidth: 1,
    }
});
