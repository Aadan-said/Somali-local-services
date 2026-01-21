import { View, ActivityIndicator, Text, StyleSheet, Dimensions } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/auth.store';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuthStore();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#1a2138', '#0f172a']}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#5c6bf0" />
                    <Text style={styles.appTitle}>SOMALI LOCAL</Text>
                    <Text style={styles.appTitle}>SERVICES</Text>
                    <Text style={styles.tagline}>Xal deg deg ah...</Text>
                </View>
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    if (user?.role === 'PROVIDER') {
        return <Redirect href="/(provider)/home" />;
    }

    if (user?.role === 'ADMIN') {
        return <Redirect href="/(admin)/home" />;
    }

    return <Redirect href="/(client)/home" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a2138',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        textAlign: 'center',
        lineHeight: 40,
        marginTop: 10,
    },
    tagline: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 15,
        letterSpacing: 4,
        textTransform: 'uppercase',
        opacity: 0.8,
    },
});
