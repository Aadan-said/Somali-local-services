import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class MobileErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Mobile Uncaught Error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <View style={styles.iconWrapper}>
                        <FontAwesome name="exclamation-triangle" size={50} color="#ef4444" />
                    </View>
                    <Text style={styles.title}>Khalad ayaa dhacay</Text>
                    <Text style={styles.subtitle}>Barnaamijku wuu is-taagay sababo farsamo awgeed. Fadlan dib u fur app-ka.</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    iconWrapper: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#fef2f2',
        borderRadius: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 24,
    },
});
