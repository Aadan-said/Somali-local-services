import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

// Get the local IP address from Expo Constants
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
const API_URL = `http://${localhost}:3000/api`;

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleResetRequest = async () => {
        if (!email) {
            Alert.alert('Error', 'Fadlan gali email-kaaga');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setIsSubmitted(true);
        } catch (error) {
            console.error('RESET_REQUEST_ERROR:', error);
            Alert.alert('Cilad', 'Khalad ayaa dhacay. Fadlan hubi internet-kaaga.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#1a2138', '#0f172a']} style={styles.background} />
                <View style={styles.card}>
                    <View style={styles.successIconWrapper}>
                        <FontAwesome name="check-circle" size={60} color="#10b981" />
                    </View>
                    <Text style={styles.title}>Check Your Email</Text>
                    <Text style={styles.subtitle}>
                        Haddii akoon uu ku jiro emailkaas, waxaan kuu soo dirnay xiriiriye aad password-ka ku bedelan karto.
                    </Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={16} color="#fff" style={{ marginRight: 10 }} />
                        <Text style={styles.backButtonText}>Dib ugu laabo Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient colors={['#1a2138', '#0f172a']} style={styles.background} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Ma ilowday Password-ka?</Text>
                    <Text style={styles.headerSubtitle}>Gali email-kaaga si aan kuu soo dirno xiriiriye.</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.label}>EMAIL-KAAGA</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.iconWrapper}>
                            <FontAwesome name="envelope" size={16} color="#5c6bf0" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="name@example.com"
                            placeholderTextColor="#94a3b8"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <TouchableOpacity style={styles.resetButton} onPress={handleResetRequest} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.resetButtonText}>Soo dir xiriiriyaha</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()} style={styles.footerLink}>
                        <Text style={styles.footerLinkText}>Dib ugu laabo Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a2138',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 30,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        fontWeight: '500',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    label: {
        fontSize: 12,
        fontWeight: '800',
        color: '#334155',
        marginBottom: 10,
        letterSpacing: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 30,
        backgroundColor: '#f8fafc',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(92, 107, 240, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '600',
    },
    resetButton: {
        backgroundColor: '#5c6bf0',
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#5c6bf0",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    footerLink: {
        alignItems: 'center',
    },
    footerLinkText: {
        color: '#64748b',
        fontWeight: '700',
        fontSize: 14,
    },
    card: {
        backgroundColor: '#fff',
        margin: 30,
        borderRadius: 30,
        padding: 40,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    successIconWrapper: {
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 35,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5c6bf0',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 15,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    },
});
