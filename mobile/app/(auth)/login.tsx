import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // ... (state and methods)

    // State
    const [role, setRole] = useState<'client' | 'provider'>('client');
    // const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone'); // Removed
    const [identifier, setIdentifier] = useState('');
    // const [email, setEmail] = useState(''); // Removed
    // const [phone, setPhone] = useState(''); // Removed
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert('Error', 'Fadlan gali Email ama Teleefan iyo Password');
            return;
        }

        try {
            let finalIdentifier = identifier.trim();
            const isEmail = finalIdentifier.includes('@');

            if (!isEmail) {
                // Phone normalization logic
                finalIdentifier = finalIdentifier.replace(/\s+/g, ''); // Remove spaces
                if (!finalIdentifier.startsWith('+')) {
                    finalIdentifier = finalIdentifier.replace(/^0+/, ''); // Remove leading zeros
                    finalIdentifier = '+252' + finalIdentifier;
                }
            }

            // Using the unified login
            await login(finalIdentifier, password);

            // Explicitly navigate to root to trigger redirection logic in index.tsx
            router.replace('/');
        } catch (error: any) {
            console.error('DEBUG_LOGIN_ERROR:', error);
            let errorMessage = 'Login Failed';

            if (error.message === 'Network Error') {
                errorMessage = 'Cilad dhanka internetka ah (Network Error).';
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            Alert.alert('Cilad', errorMessage);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#1a2138', '#0f172a']} // Deep premium blue gradient
                style={styles.background}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Animated.View style={{
                    flex: 1,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}>
                    {/* Top Section: Logo & Branding */}
                    <View style={styles.topSection}>
                        <View style={styles.headerGlow} />
                        <Text style={styles.appTitlePrimary}>SOMALI LOCAL</Text>
                        <Text style={styles.appTitleSecondary}>SERVICES</Text>
                        <View style={styles.taglineWrapper}>
                            <View style={styles.taglineLine} />
                            <Text style={styles.tagline}>YOUR TRUSTED PARTNER</Text>
                            <View style={styles.taglineLine} />
                        </View>
                    </View>

                    {/* Bottom Section: White Card Form */}
                    <View style={styles.bottomCardContainer}>
                        <Text style={styles.headerTitle}>Welcome Back</Text>
                        <Text style={styles.headerSubtitle}>Gali macluumaadkaaga hoos ku qoran</Text>

                        {/* Modern Role Toggle */}
                        {/* Note: Roles are often determined by the backend user data, but keeping this purely visual or for registration intent if needed. 
                            For login, the role comes from the user record. */}
                        <View style={styles.toggleWrapper}>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[styles.toggleButton, role === 'client' && styles.toggleActive]}
                                    onPress={() => setRole('client')}
                                >
                                    <FontAwesome name="user" size={16} color={role === 'client' ? '#fff' : '#5c6bf0'} />
                                    <Text style={[styles.toggleText, role === 'client' && styles.textActive]}>Macmiil</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.toggleButton, role === 'provider' && styles.toggleActive]}
                                    onPress={() => setRole('provider')}
                                >
                                    <FontAwesome name="briefcase" size={16} color={role === 'provider' ? '#fff' : '#5c6bf0'} />
                                    <Text style={[styles.toggleText, role === 'provider' && styles.textActive]}>Adeeg-bixiye</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Unified Input Field */}
                        <Text style={styles.label}>EMAIL AMA TELEEFAN</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="user" size={16} color="#5c6bf0" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com ama 61xxxxxxx"
                                placeholderTextColor="#94a3b8"
                                value={identifier}
                                onChangeText={setIdentifier}
                                autoCapitalize="none"
                                keyboardType="email-address" // Allows @ and numbers
                            />
                        </View>

                        {/* Password Input */}
                        <Text style={styles.label}>PASSWORD SIRTA AH</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="lock" size={18} color="#5c6bf0" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.eyeIconContainer,
                                    showPassword && { backgroundColor: 'rgba(92, 107, 240, 0.15)' }
                                ]}>
                                    <FontAwesome
                                        name={showPassword ? "eye" : "eye-slash"}
                                        size={18}
                                        color={showPassword ? "#5c6bf0" : "#94a3b8"}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotPass} onPress={() => router.push('/(auth)/forgot-password')}>
                            <Text style={styles.forgotPassText}>Ma ilowday?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>Soo Gal</Text>
                            )}
                        </TouchableOpacity>

                        {/* Footer for Register */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Wali ma is-diiwaangalisay? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                <Text style={styles.linkText}>Is-diiwaangeli</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Animated.View>
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
        justifyContent: 'space-between',
    },
    topSection: {
        height: height * 0.24, // Optimized height
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        overflow: 'hidden',
    },
    headerGlow: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(92, 107, 240, 0.25)',
        top: '20%',
        left: '32%',
        shadowColor: '#5c6bf0',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 50,
        elevation: 20,
    },
    appTitlePrimary: {
        fontSize: 20,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: 5,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    appTitleSecondary: {
        fontSize: 40,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        textAlign: 'center',
        marginTop: -2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    taglineWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
    },
    taglineLine: {
        width: 15,
        height: 1.5,
        backgroundColor: 'rgba(92, 107, 240, 0.5)',
        marginHorizontal: 10,
        borderRadius: 2,
    },
    tagline: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2.5,
        textTransform: 'uppercase',
        opacity: 0.9,
    },
    bottomCardContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 40, // More rounded corners
        borderTopRightRadius: 40,
        paddingHorizontal: 30,
        paddingTop: 30,
        paddingBottom: 20,
        minHeight: height * 0.78, // Expanded card to meet top section
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 25, // Reduced margin
        fontWeight: '500',
    },
    toggleWrapper: {
        marginBottom: 30,
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        padding: 5,
        width: '100%',
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
    },
    toggleActive: {
        backgroundColor: '#5c6bf0',
        shadowColor: "#5c6bf0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    toggleText: {
        marginLeft: 8,
        fontWeight: '700',
        color: '#64748b',
        fontSize: 15,
    },
    textActive: {
        color: '#fff',
    },
    label: {
        fontSize: 12,
        fontWeight: '800',
        color: '#334155',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 8, // Taller inputs
        marginBottom: 24,
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
    eyeIcon: {
        marginLeft: 8,
    },
    eyeIconContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    forgotPass: {
        alignSelf: 'flex-end',
        marginTop: -10,
        marginBottom: 35,
    },
    forgotPassText: {
        color: '#5c6bf0',
        fontWeight: '700',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#5c6bf0',
        borderRadius: 18,
        paddingVertical: 20, // Taller button
        alignItems: 'center',
        marginBottom: 28,
        shadowColor: "#5c6bf0",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
    },
    linkText: {
        color: '#5c6bf0',
        fontWeight: '800',
        fontSize: 14,
    },
});
