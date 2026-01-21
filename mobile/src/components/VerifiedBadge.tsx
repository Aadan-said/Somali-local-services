import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

interface VerifiedBadgeProps {
    size?: number;
}

export const VerifiedBadge = ({ size = 16 }: VerifiedBadgeProps) => {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={[styles.gradient, { borderRadius: size / 2 }]}
            >
                <FontAwesome name="check" size={size * 0.6} color="#fff" />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
